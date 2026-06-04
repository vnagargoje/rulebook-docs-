import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { StationEntity, VehicleEntity } from '@yugo/nestjs-database/entities'
import { VehicleStatus } from '@yugo/shared'
import { UpdateVehicleCommand } from '../../impl/vehicles/update-vehicle.command.js'
import { EntityManager } from 'typeorm'

@CommandHandler(UpdateVehicleCommand)
export class UpdateVehicleHandler implements ICommandHandler<UpdateVehicleCommand> {
    constructor(@InjectEntityManager() private readonly manager: EntityManager) { }

    async execute(command: UpdateVehicleCommand) {
        const { vehicleId, payload } = command
        const vehicle = await this.manager.findOne(VehicleEntity, {
            where: { id: vehicleId },
        })
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found')
        }

        const currentStatus = vehicle.status
        const newStatus = payload.status

        if (newStatus !== undefined && currentStatus !== newStatus) {
            if (currentStatus === VehicleStatus.IN_USE) {
                throw new BadRequestException('Cannot change status of a vehicle that is in use')
            }

            if (newStatus === VehicleStatus.IN_USE) {
                throw new BadRequestException('Cannot transition vehicle status to in_use manually')
            }

            if (newStatus === VehicleStatus.UNDER_MAINTENANCE) {
                if (currentStatus !== VehicleStatus.AVAILABLE) {
                    throw new BadRequestException('Vehicle must be available to be put under maintenance')
                }
                vehicle.stationId = null as any
                payload.stationId = null as any
            }

            if (currentStatus === VehicleStatus.UNDER_MAINTENANCE && newStatus === VehicleStatus.AVAILABLE) {
                const targetStationId = payload.stationId || vehicle.stationId
                if (!targetStationId) {
                    throw new BadRequestException(
                        'Station assignment is mandatory when transitioning vehicle from under maintenance to available',
                    )
                }
                const station = await this.manager.findOne(StationEntity, {
                    where: { id: targetStationId },
                })
                if (!station) {
                    throw new BadRequestException('Assigned station not found')
                }
            }
        }

        Object.assign(vehicle, payload)
        await this.manager.save(vehicle)

        return this.manager.findOne(VehicleEntity, {
            where: { id: vehicleId },
            relations: { station: true },
        })
    }
}
