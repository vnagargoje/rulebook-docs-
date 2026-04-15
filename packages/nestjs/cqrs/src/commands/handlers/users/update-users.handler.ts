import { NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { RoleEntity, UserEntity } from '@yugo/nestjs-database/entities'
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
                relations: { roles: true },
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

            const { role, ...updateData } = body
            Object.assign(user, updateData)

            return manager.save(user)
        })
    }
}
