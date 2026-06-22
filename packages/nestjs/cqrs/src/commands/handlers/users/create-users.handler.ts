import { BadRequestException, ConflictException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { AddressEntity, RoleEntity, UserEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { CreateUserCommand } from '../../impl/users/create-users.command.js'
import { computeKycStatus } from 'src/utils/kyc-status.js'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: CreateUserCommand) {
        const body = command.payload
        const manager = this.datasource.manager

        return manager.transaction(async (manager) => {
            const role = await manager.findOne(RoleEntity, {
                where: { name: body.role },
            })

            if (!role) {
                throw new BadRequestException(`User role ${body.role} does not exist`)
            }

            const isEmployee = body.role !== 'customer'
            const entityName = isEmployee ? 'Employee' : 'Customer'

            if (body.mobilenumber) {
                const existingUserMobile = await manager.findOne(UserEntity, {
                    where: { mobilenumber: body.mobilenumber },
                })
                if (existingUserMobile) {
                    throw new ConflictException(`${entityName} with this mobile number already exists.`)
                }
            }

            if (body.email) {
                const existingUserEmail = await manager.findOne(UserEntity, {
                    where: { email: body.email },
                })
                if (existingUserEmail) {
                    throw new ConflictException(`${entityName} with this email address already exists.`)
                }
            }

            const user = manager.create(UserEntity, {
                email: body.email,
                mobilenumber: body.mobilenumber,
                firstName: body.firstName,
                lastName: body.lastName,
                gender: body.gender,
                properties: body.properties,
                dateOfBirth: body.dateOfBirth,
                roles: [role],
                active: body.active,
            })

            await manager.save(user)

            if (body.address) {
                const address = manager.create(AddressEntity, {
                    lineOne: body.address.lineOne,
                    lineTwo: body.address.lineTwo,
                    pincode: body.address.pincode,
                    cityId: body.address.cityId,
                    userId: user.id,
                })
                await manager.save(address)
                user.addresses = [address]
            }

            const savedUser = await manager.findOne(UserEntity, {
                where: { id: user.id },
                relations: { roles: true, addresses: { city: { state: true } }, kycs: true },
            })

            if (savedUser) {
                savedUser.kycStatus = computeKycStatus(savedUser.kycs)
            }

            return savedUser
        })
    }
}
