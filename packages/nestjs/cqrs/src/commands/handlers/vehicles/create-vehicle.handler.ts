import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { VehicleEntity } from '@yugo/nestjs-database/entities'
import { CreateVehicleCommand } from 'src/commands/impl/vehicles/create-vehicle.command.js'
import { EntityManager } from 'typeorm'

@CommandHandler(CreateVehicleCommand)
export class CreateVehicleHandler implements ICommandHandler<CreateVehicleCommand> {
    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: CreateVehicleCommand) {
        const { payload } = command

        return this.manager.transaction(async (manager) => {
            const vehicle = manager.create(VehicleEntity, {
                vehicleNumber: payload.vehicleNumber,
                rcNumber: payload.rcNumber,
                chassisNumber: payload.chassisNumber,
                gpsId: payload.gpsId,
                properties: payload.properties,
                stationId: payload.stationId,
            })

            await manager.save(vehicle)

            return manager.findOne(VehicleEntity, {
                where: { id: vehicle.id },
                relations: { station: true },
            })
        })
    }
}
