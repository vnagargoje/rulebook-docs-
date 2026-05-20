import { NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import {
    AddressEntity,
    HubStationEntity,
    StationEntity,
    SwapStationEntity,
    UserEntity,
    VehicleStationEntity,
} from '@yugo/nestjs-database/entities'
import { StationType } from '@yugo/shared'
import { CreateStationCommand } from 'src/commands/impl/stations/create-station.command.js'
import { DataSource } from 'typeorm'

@CommandHandler(CreateStationCommand)
export class CreateStationHandler implements ICommandHandler<CreateStationCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: CreateStationCommand) {
        const { payload } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const entityClass =
                payload.type === StationType.HUB_STATION
                    ? HubStationEntity
                    : payload.type === StationType.VEHICLE_STATION
                        ? VehicleStationEntity
                        : SwapStationEntity
            const station = manager.create(entityClass, {
                name: payload.name,
                type: payload.type,
                longitude: payload.longitude,
                latitude: payload.latitude,
                active: payload.active,
            })

            await manager.save(station)

            if (payload.managerId) {
                const user = await manager.findOne(UserEntity, { where: { id: payload.managerId } })
                if (!user) {
                    throw new NotFoundException(`Manager not found: ${payload.managerId}`)
                }
                user.stationId = station.id
                await manager.save(user)
            }

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
