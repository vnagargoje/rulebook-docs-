import { Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { NotificationEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { UpdateNotificationCommand } from '../../impl/notifications/update-notification.command.js'

@CommandHandler(UpdateNotificationCommand)
export class UpdateNotificationHandler implements ICommandHandler<UpdateNotificationCommand> {
    private readonly logger = new Logger(UpdateNotificationHandler.name)

    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: UpdateNotificationCommand) {
        const { notificationId, payload } = command
        const manager = this.datasource.manager

        const notification = await manager.findOne(NotificationEntity, { where: { id: notificationId } })
        if (!notification) {
            throw new NotFoundException('Notification template not found')
        }

        this.logger.log(`Updating notification template: ${notificationId}`)

        Object.assign(notification, payload)
        return manager.save(notification)
    }
}
