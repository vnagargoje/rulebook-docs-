import { BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BatteryEntity, BatteryTransportEntity, StationEntity, VehicleEntity } from '@yugo/nestjs-database/entities'
import { BatteryTransportStatus, BatteryStatus, StationType, VehicleStatus, VehicleType } from '@yugo/shared'
import { DispatchBatteriesCommand } from 'src/commands/impl'
import { DataSource, In } from 'typeorm'

@CommandHandler(DispatchBatteriesCommand)
export class DispatchBatteriesHandler implements ICommandHandler<DispatchBatteriesCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: DispatchBatteriesCommand) {
        const { fromStationId, toStationId, vehicleId, batteryQrIds, initiatedById } = command
        const manager = this.datasource.manager

        if (batteryQrIds.length === 0) {
            throw new BadRequestException('At least one battery must be selected')
        }

        if (fromStationId === toStationId) {
            throw new BadRequestException('Source and destination stations cannot be the same')
        }

        return manager.transaction(async (manager) => {
            const fromStation = await manager.findOne(StationEntity, { where: { id: fromStationId } })
            if (!fromStation) {
                throw new NotFoundException('Source station not found')
            }

            const toStation = await manager.findOne(StationEntity, { where: { id: toStationId } })
            if (!toStation) {
                throw new NotFoundException('Destination station not found')
            }

            // Validate direction: Hub→Swap sends charged, Swap→Hub sends drained
            if (fromStation.type === StationType.HUB_STATION && toStation.type !== StationType.SWAP_STATION) {
                throw new BadRequestException('Hub stations can only dispatch to Swap stations')
            }
            if (fromStation.type === StationType.SWAP_STATION && toStation.type !== StationType.HUB_STATION) {
                throw new BadRequestException('Swap stations can only dispatch to Hub stations')
            }

            const vehicle = await manager.findOne(VehicleEntity, { where: { id: vehicleId } })
            if (!vehicle) {
                throw new NotFoundException('Vehicle not found')
            }
            if (vehicle.type !== VehicleType.TRANSPORT) {
                throw new BadRequestException('Only transport vehicles can be used for battery transports')
            }
            if (vehicle.status === VehicleStatus.IN_USE) {
                throw new BadRequestException('Vehicle is currently in transit and cannot be assigned to another transport')
            }

            const batteries = await manager.find(BatteryEntity, {
                where: { batteryQrId: In(batteryQrIds) },
            })

            if (batteries.length !== batteryQrIds.length) {
                const foundQrIds = batteries.map((b) => b.batteryQrId)
                const missing = batteryQrIds.filter((qr) => !foundQrIds.includes(qr))
                throw new NotFoundException(`Batteries not found: ${missing.join(', ')}`)
            }

            // Validate each battery
            const expectedStatus =
                fromStation.type === StationType.HUB_STATION ? BatteryStatus.CHARGED : BatteryStatus.DRAINED

            for (const battery of batteries) {
                if (battery.stationId !== fromStationId) {
                    throw new BadRequestException(`Battery ${battery.batteryQrId} does not belong to this station`)
                }
                if (battery.status === BatteryStatus.IN_TRANSIT) {
                    throw new BadRequestException(`Battery ${battery.batteryQrId} is already in transit`)
                }
                if (battery.status === BatteryStatus.IN_USE) {
                    throw new BadRequestException(`Battery ${battery.batteryQrId} is currently in use`)
                }
                if (battery.status !== expectedStatus) {
                    throw new BadRequestException(
                        `Battery ${battery.batteryQrId} must be ${expectedStatus} to dispatch from this station (current: ${battery.status})`,
                    )
                }
            }

            const movement = manager.create(BatteryTransportEntity, {
                fromStationId,
                toStationId,
                vehicleId,
                initiatedById,
                batteryIds: batteries.map((b) => b.id),
                status: BatteryTransportStatus.IN_TRANSIT,
                receivedById: null,
                receivedAt: null,
            })
            await manager.save(movement)

            for (const battery of batteries) {
                battery.status = BatteryStatus.IN_TRANSIT
                battery.stationId = null as any
            }
            await manager.save(batteries)

            vehicle.status = VehicleStatus.IN_USE
            await manager.save(vehicle)

            return manager.findOne(BatteryTransportEntity, {
                where: { id: movement.id },
                relations: ['fromStation', 'toStation', 'vehicle'],
            })
        })
    }
}
