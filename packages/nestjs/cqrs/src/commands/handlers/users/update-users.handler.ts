import { NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { AddressEntity, RoleEntity, UserEntity } from '@yugo/nestjs-database/entities'
import { EntityManager } from 'typeorm'
import { UpdateUserCommand } from '../../impl/users/update-users.command.js'

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

    async execute(command: UpdateUserCommand) {
        const { userId, payload: body, canUpdateRole } = command

        return this.manager.transaction(async (manager) => {
            const user = await manager.findOne(UserEntity, {
                where: { id: userId },
                relations: { roles: true, addresses: { city: { state: true } } },
            })

            if (!user) {
                throw new NotFoundException('User not found')
            }

            if (canUpdateRole && body.role) {
                let role = await manager.findOne(RoleEntity, {
                    where: { name: body.role },
                })
                if (!role) {
                    role = manager.create(RoleEntity, { name: body.role })
                    await manager.save(role)
                }
                user.roles = [role]
            }

            if (body.address) {
                const existingAddress = user.addresses?.[0]
                if (existingAddress) {
                    Object.assign(existingAddress, {
                        lineOne: body.address.lineOne ?? existingAddress.lineOne,
                        lineTwo: body.address.lineTwo ?? existingAddress.lineTwo,
                        pincode: body.address.pincode ?? existingAddress.pincode,
                        cityId: body.address.cityId ?? existingAddress.cityId,
                    })
                    await manager.save(AddressEntity, existingAddress)
                } else {
                    const address = manager.create(AddressEntity, {
                        lineOne: body.address.lineOne,
                        lineTwo: body.address.lineTwo,
                        pincode: body.address.pincode,
                        cityId: body.address.cityId,
                        userId: user.id,
                    })
                    await manager.save(address)
                }
            }

            const { role, address, ...updateData } = body
            Object.assign(user, updateData)

            await manager.save(user)

            return manager.findOne(UserEntity, {
                where: { id: userId },
                relations: { roles: true, addresses: { city: { state: true } } },
            })
        })
    }
}
