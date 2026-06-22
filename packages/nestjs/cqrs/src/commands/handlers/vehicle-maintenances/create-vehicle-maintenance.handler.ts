import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { VehicleEntity, VehicleMaintenanceEntity } from '@yugo/nestjs-database/entities'
import { VehicleMaintenanceStatus, VehicleStatus } from '@yugo/shared'
import { CreateVehicleMaintenanceCommand } from '../../impl/vehicle-maintenances/create-vehicle-maintenance.command.js'
import { EntityManager } from 'typeorm'

@CommandHandler(CreateVehicleMaintenanceCommand)
export class CreateVehicleMaintenanceHandler implements ICommandHandler<CreateVehicleMaintenanceCommand> {
    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: CreateVehicleMaintenanceCommand) {
        const { payload } = command

        return this.manager.transaction(async (manager) => {
            const vehicle = await manager.findOne(VehicleEntity, {
                where: { id: payload.vehicleId },
            })
            if (!vehicle) {
                throw new NotFoundException('Vehicle not found')
            }

            if (payload.expectedFixDate) {
                const fixDate = new Date(payload.expectedFixDate)
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (fixDate < today) {
                    throw new BadRequestException('Expected fix date cannot be in the past')
                }
            }

            const maintenance = manager.create(VehicleMaintenanceEntity, {
                vehicleId: payload.vehicleId,
                issueDescription: payload.issueDescription,
                status: payload.status,
                expectedFixDate: payload.expectedFixDate ? new Date(payload.expectedFixDate) : null,
                remarks: payload.remarks ?? null,
            })

            await manager.save(maintenance)

            const finalStatus = payload.status ?? VehicleMaintenanceStatus.OPEN
            if (finalStatus !== VehicleMaintenanceStatus.COMPLETED) {
                if (vehicle.status !== VehicleStatus.AVAILABLE) {
                    throw new BadRequestException('Only vehicles with available status can be put under maintenance')
                }
                vehicle.status = VehicleStatus.UNDER_MAINTENANCE
                await manager.save(vehicle)
            }


            return manager.findOne(VehicleMaintenanceEntity, {
                where: { id: maintenance.id },
                relations: { vehicle: true },
            })
        })
    }
}
