import { Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { NotificationEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { DeleteNotificationCommand } from '../../impl/notifications/delete-notification.command'

@CommandHandler(DeleteNotificationCommand)
export class DeleteNotificationHandler implements ICommandHandler<DeleteNotificationCommand> {
    private readonly logger = new Logger(DeleteNotificationHandler.name)

    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: DeleteNotificationCommand) {
        const { notificationId } = command
        const manager = this.datasource.manager

        const notification = await manager.findOne(NotificationEntity, { where: { id: notificationId } })
        if (!notification) {
            throw new NotFoundException('Notification template not found')
        }

        this.logger.log(`Soft-deleting notification template: ${notificationId}`)

        await manager.softDelete(NotificationEntity, notificationId)
        return { id: notificationId, success: true }
    }
}
