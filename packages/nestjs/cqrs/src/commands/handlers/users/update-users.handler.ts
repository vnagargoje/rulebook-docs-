import { ConflictException, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { AddressEntity, RoleEntity, UserEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { UpdateUserCommand } from '../../impl/users/update-users.command.js'
import { InjectInngestService } from '@yugo/nestjs-inngest'
import { type HenchmenInngestClient } from '@yugo/utils'
import { computeKycStatus } from 'src/utils/kyc-status.js'

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @InjectInngestService() private readonly inngest: HenchmenInngestClient,
    ) {}

    async execute(command: UpdateUserCommand) {
        const { userId, payload: body, canUpdateRole } = command
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const user = await manager.findOne(UserEntity, {
                where: { id: userId },
                relations: { roles: true, addresses: { city: { state: true } } },
            })

            if (!user) {
                throw new NotFoundException('User not found')
            }

            const isEmployee =
                (body.role ? body.role !== 'customer' : user.roles?.some((r) => r.name !== 'customer')) ?? false
            const entityName = isEmployee ? 'Employee' : 'Customer'

            if (body.mobilenumber && body.mobilenumber !== user.mobilenumber) {
                const existingUserMobile = await manager.findOne(UserEntity, {
                    where: { mobilenumber: body.mobilenumber },
                })
                if (existingUserMobile && existingUserMobile.id !== user.id) {
                    throw new ConflictException(`${entityName} with this mobile number already exists.`)
                }
            }

            if (body.email && body.email !== user.email) {
                const existingUserEmail = await manager.findOne(UserEntity, {
                    where: { email: body.email },
                })
                if (existingUserEmail && existingUserEmail.id !== user.id) {
                    throw new ConflictException(`${entityName} with this email address already exists.`)
                }
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

            await this.inngest.send({
                name: 'user/user.update',
                data: {
                    userId: user.id,
                    user: user,
                },
            })

            const savedUser = await manager.findOne(UserEntity, {
                where: { id: userId },
                relations: { roles: true, addresses: { city: { state: true } }, kycs: true },
            })

            if (savedUser) {
                savedUser.kycStatus = computeKycStatus(savedUser.kycs)
            }

            return savedUser
        })
    }
}
