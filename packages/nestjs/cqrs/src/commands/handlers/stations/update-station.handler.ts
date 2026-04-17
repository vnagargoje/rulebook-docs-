import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { AddressEntity, StationEntity } from '@yugo/nestjs-database/entities'
import { UpdateStationCommand } from '../../impl/stations/update-station.command.js'
import { DataSource } from 'typeorm'

@CommandHandler(UpdateStationCommand)
export class UpdateStationHandler implements ICommandHandler<UpdateStationCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: UpdateStationCommand) {
        const { stationId, payload } = command
        const manager = this.datasource.manager
        const station = await manager.findOne(StationEntity, {
            where: { id: stationId },
        })
        if (!station) {
            throw new Error('Station not found')
        }

        const { address, ...stationPayload } = payload
        Object.assign(station, stationPayload)
        await manager.save(station)

        if (address) {
            let addressEntity: AddressEntity | null = null
            if (station.addressId) {
                addressEntity = await manager.findOne(AddressEntity, {
                    where: { id: station.addressId },
                })
            }

            if (addressEntity) {
                Object.assign(addressEntity, address)
                await manager.save(addressEntity)
            } else {
                addressEntity = manager.create(AddressEntity, {
                    lineOne: address.lineOne,
                    lineTwo: address.lineTwo,
                    pincode: address.pincode,
                    cityId: address.cityId,
                })
                await manager.save(addressEntity)
                station.address = addressEntity
                await manager.save(station)
            }
        }

        return manager.findOne(StationEntity, {
            where: { id: stationId },
            relations: { address: true },
        })
    }
}
