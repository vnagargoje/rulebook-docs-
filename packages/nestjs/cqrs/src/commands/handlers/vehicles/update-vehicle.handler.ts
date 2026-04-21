import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { VehicleEntity } from '@yugo/nestjs-database/entities'
import { UpdateVehicleCommand } from '../../impl/vehicles/update-vehicle.command.js'
import { EntityManager } from 'typeorm'

@CommandHandler(UpdateVehicleCommand)
export class UpdateVehicleHandler implements ICommandHandler<UpdateVehicleCommand> {
    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: UpdateVehicleCommand) {
        const { vehicleId, payload } = command
        const vehicle = await this.manager.findOne(VehicleEntity, {
            where: { id: vehicleId },
        })
        if (!vehicle) {
            throw new Error('Vehicle not found')
        }

        Object.assign(vehicle, payload)
        await this.manager.save(vehicle)

        return this.manager.findOne(VehicleEntity, {
            where: { id: vehicleId },
            relations: { station: true },
        })
    }
}
