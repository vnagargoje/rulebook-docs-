import { NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { AddressEntity, UserEntity } from '@yugo/nestjs-database/entities'
import { AddressType } from '@yugo/shared'
import { DataSource } from 'typeorm'
import { UpdateUserAddressesCommand } from '../../impl/users/update-user-addresses.command.js'

@CommandHandler(UpdateUserAddressesCommand)
export class UpdateUserAddressesHandler implements ICommandHandler<UpdateUserAddressesCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: UpdateUserAddressesCommand) {
        const { userId, payload } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const user = await manager.findOne(UserEntity, {
                where: { id: userId },
                relations: ['addresses'],
            })

            if (!user) {
                throw new NotFoundException('User not found')
            }

            if (payload.current) {
                let address = user.addresses?.find((a) => a.type === AddressType.CURRENT)
                if (address) {
                    Object.assign(address, payload.current)
                } else {
                    address = manager.create(AddressEntity, {
                        ...payload.current,
                        type: AddressType.CURRENT,
                        userId: user.id,
                    })
                }
                await manager.save(AddressEntity, address)
            }

            if (payload.permanent) {
                let address = user.addresses?.find((a) => a.type === AddressType.PERMANENT)
                if (address) {
                    Object.assign(address, payload.permanent)
                } else {
                    address = manager.create(AddressEntity, {
                        ...payload.permanent,
                        type: AddressType.PERMANENT,
                        userId: user.id,
                    })
                }
                await manager.save(AddressEntity, address)
            }

            return manager.findOne(UserEntity, {
                where: { id: userId },
                relations: { roles: true, addresses: { city: { state: true } } },
            })
        })
    }
}
