import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { AddressEntity, StationEntity, HubStationEntity, SwapStationEntity } from '@yugo/nestjs-database/entities'
import { CreateStationCommand } from 'src/commands/impl/stations/create-station.command.js'
import { DataSource } from 'typeorm'
import { StationType } from '@yugo/shared'

@CommandHandler(CreateStationCommand)
export class CreateStationHandler implements ICommandHandler<CreateStationCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: CreateStationCommand) {
        const { payload } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const entityClass = payload.type === StationType.HUB_STATION ? HubStationEntity : SwapStationEntity
            const station = manager.create(entityClass, {
                name: payload.name,
                type: payload.type,
                longitude: payload.longitude,
                latitude: payload.latitude,
                active: payload.active,
                managerId: payload.managerId,
            })

            await manager.save(station)

            if (payload.address) {
                const address = manager.create(AddressEntity, {
                    lineOne: payload.address.lineOne,
                    lineTwo: payload.address.lineTwo,
                    pincode: payload.address.pincode,
                    cityId: payload.address.cityId,
                })
                await manager.save(address)
                station.address = address
                await manager.save(station)
            }

            return manager.findOne(StationEntity, {
                where: { id: station.id },
                relations: { address: true },
            })
        })
    }
}
