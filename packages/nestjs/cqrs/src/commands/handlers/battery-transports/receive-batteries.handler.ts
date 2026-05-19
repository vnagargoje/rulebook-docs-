import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BatteryEntity, BatteryTransportEntity, VehicleEntity } from '@yugo/nestjs-database/entities'
import { BatteryStatus, BatteryTransportStatus, StationType, VehicleStatus } from '@yugo/shared'
import { ReceiveBatteriesCommand } from 'src/commands/impl'
import { DataSource, In } from 'typeorm'

@CommandHandler(ReceiveBatteriesCommand)
export class ReceiveBatteriesHandler implements ICommandHandler<ReceiveBatteriesCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: ReceiveBatteriesCommand) {
        const { transportId, batteryQrIds, receivedById } = command
        const manager = this.datasource.manager

        if (batteryQrIds.length === 0) {
            throw new BadRequestException('At least one battery must be scanned')
        }

        return manager.transaction(async (manager) => {
            const transport = await manager.findOne(BatteryTransportEntity, {
                where: { id: transportId },
                relations: ['toStation'],
            })
            if (!transport) {
                throw new NotFoundException('Transport not found')
            }
            if (transport.status === BatteryTransportStatus.DELIVERED) {
                throw new BadRequestException('This transport has already been received')
            }

            const batteries = await manager.find(BatteryEntity, {
                where: { batteryQrId: In(batteryQrIds) },
            })

            if (batteries.length !== batteryQrIds.length) {
                const foundQrIds = batteries.map((b) => b.batteryQrId)
                const missing = batteryQrIds.filter((qr) => !foundQrIds.includes(qr))
                throw new NotFoundException(`Batteries not found: ${missing.join(', ')}`)
            }

            for (const battery of batteries) {
                if (!transport.batteryIds.includes(battery.id)) {
                    throw new BadRequestException(`Battery ${battery.batteryQrId} is not part of this transport`)
                }
                if (battery.status !== BatteryStatus.IN_TRANSIT) {
                    throw new BadRequestException(
                        `Battery ${battery.batteryQrId} is not in transit (current: ${battery.status})`,
                    )
                }
            }

            if (batteries.length !== transport.batteryIds.length) {
                throw new BadRequestException(
                    `Expected ${transport.batteryIds.length} batteries but received ${batteries.length}. All batteries in the transport must be scanned.`,
                )
            }

            const arrivalStatus =
                transport.toStation.type === StationType.SWAP_STATION ? BatteryStatus.AVAILABLE : BatteryStatus.DRAINED

            for (const battery of batteries) {
                battery.stationId = transport.toStationId
                battery.status = arrivalStatus
            }
            await manager.save(batteries)

            transport.status = BatteryTransportStatus.DELIVERED
            transport.receivedById = receivedById
            transport.receivedAt = new Date()
            await manager.save(transport)

            const vehicle = await manager.findOne(VehicleEntity, { where: { id: transport.vehicleId } })
            if (vehicle) {
                vehicle.status = VehicleStatus.AVAILABLE
                await manager.save(vehicle)
            }

            return manager.findOne(BatteryTransportEntity, {
                where: { id: transport.id },
                relations: ['fromStation', 'toStation', 'vehicle'],
            })
        })
    }
}
