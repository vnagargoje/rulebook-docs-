import { NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { UserEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { RegisterDeviceTokenCommand } from '../../impl/users/register-device-token.command.js'

@CommandHandler(RegisterDeviceTokenCommand)
export class RegisterDeviceTokenHandler implements ICommandHandler<RegisterDeviceTokenCommand> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: RegisterDeviceTokenCommand) {
        const { userId, deviceToken } = command
        const manager = this.datasource.manager

        return manager.transaction(async (transactionManager) => {
            const user = await transactionManager.findOne(UserEntity, {
                where: { id: userId },
            })

            if (!user) {
                throw new NotFoundException('User not found')
            }

            const properties = user.properties || {}
            user.properties = {
                ...properties,
                deviceToken,
            }

            await transactionManager.save(UserEntity, user)

            return {
                success: true,
                message: 'Device token registered successfully',
            }
        })
    }
}
