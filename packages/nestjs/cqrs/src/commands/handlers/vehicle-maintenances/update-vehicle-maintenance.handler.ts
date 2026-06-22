import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { VehicleEntity, VehicleMaintenanceEntity } from '@yugo/nestjs-database/entities'
import { VehicleMaintenanceStatus, VehicleStatus } from '@yugo/shared'
import { UpdateVehicleMaintenanceCommand } from '../../impl/vehicle-maintenances/update-vehicle-maintenance.command.js'
import { EntityManager } from 'typeorm'

@CommandHandler(UpdateVehicleMaintenanceCommand)
export class UpdateVehicleMaintenanceHandler implements ICommandHandler<UpdateVehicleMaintenanceCommand> {
    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: UpdateVehicleMaintenanceCommand) {
        const { id, payload } = command

        return this.manager.transaction(async (manager) => {
            const maintenance = await manager.findOne(VehicleMaintenanceEntity, {
                where: { id },
            })
            if (!maintenance) {
                throw new NotFoundException('Maintenance record not found')
            }

            const vehicleId = payload.vehicleId ?? maintenance.vehicleId
            const vehicle = await manager.findOne(VehicleEntity, {
                where: { id: vehicleId },
            })
            if (!vehicle) {
                throw new NotFoundException('Vehicle not found')
            }

            if (payload.expectedFixDate) {
                const fixDate = new Date(payload.expectedFixDate)
                if (fixDate < maintenance.createdAt) {
                    throw new BadRequestException('Expected fix date cannot be before reported date')
                }
            }

            const oldVehicleId = maintenance.vehicleId
            const isVehicleChanged = payload.vehicleId && payload.vehicleId !== oldVehicleId

            manager.merge(VehicleMaintenanceEntity, maintenance, payload)

            if (maintenance.status === VehicleMaintenanceStatus.OPEN) {
                if (vehicle.status !== VehicleStatus.UNDER_MAINTENANCE) {
                    if (vehicle.status !== VehicleStatus.AVAILABLE) {
                        throw new BadRequestException(
                            'Only vehicles with available status can be put under maintenance',
                        )
                    }
                    vehicle.status = VehicleStatus.UNDER_MAINTENANCE
                    await manager.save(vehicle)
                }
            } else {
                if (vehicle.status === VehicleStatus.UNDER_MAINTENANCE) {
                    vehicle.status = VehicleStatus.AVAILABLE
                    await manager.save(vehicle)
                }
            }

            // Update old vehicle status if changed
            if (isVehicleChanged && oldVehicleId) {
                const oldVehicle = await manager.findOne(VehicleEntity, {
                    where: { id: oldVehicleId },
                })
                if (oldVehicle) {
                    const oldOpenCount = await manager.count(VehicleMaintenanceEntity, {
                        where: {
                            vehicleId: oldVehicleId,
                            status: VehicleMaintenanceStatus.OPEN,
                        },
                    })
                    if (oldOpenCount === 0 && oldVehicle.status === VehicleStatus.UNDER_MAINTENANCE) {
                        oldVehicle.status = VehicleStatus.AVAILABLE
                        await manager.save(oldVehicle)
                    }
                }
            }
            await manager.save(maintenance)

            return manager.findOne(VehicleMaintenanceEntity, {
                where: { id },
                relations: { vehicle: true },
            })
        })
    }
}
