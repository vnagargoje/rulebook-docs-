import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { AddressEntity, StationEntity } from '@yugo/nestjs-database/entities'
import { UpdateStationCommand } from '../../impl/stations/update-station.command.js'
import { EntityManager } from 'typeorm'

@CommandHandler(UpdateStationCommand)
export class UpdateStationHandler implements ICommandHandler<UpdateStationCommand> {
    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: UpdateStationCommand) {
        const { stationId, payload } = command
        const station = await this.manager.findOne(StationEntity, {
            where: { id: stationId },
        })
        if (!station) {
            throw new Error('Station not found')
        }

        const { address, ...stationPayload } = payload
        Object.assign(station, stationPayload)
        await this.manager.save(station)

        if (address) {
            let addressEntity: AddressEntity | null = null
            if (station.addressId) {
                addressEntity = await this.manager.findOne(AddressEntity, {
                    where: { id: station.addressId },
                })
            }

            if (addressEntity) {
                Object.assign(addressEntity, address)
                await this.manager.save(addressEntity)
            } else {
                addressEntity = this.manager.create(AddressEntity, {
                    lineOne: address.lineOne,
                    lineTwo: address.lineTwo,
                    pincode: address.pincode,
                    cityId: address.cityId,
                })
                await this.manager.save(addressEntity)
                station.address = addressEntity
                await this.manager.save(station)
            }
        }

        return this.manager.findOne(StationEntity, {
            where: { id: stationId },
            relations: { address: true },
        })
    }
}
