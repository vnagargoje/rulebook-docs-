import { Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { NotificationEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { CreateNotificationCommand } from '../../impl/notifications/create-notification.command'

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler implements ICommandHandler<CreateNotificationCommand> {
    private readonly logger = new Logger(CreateNotificationHandler.name)

    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(command: CreateNotificationCommand) {
        const { payload } = command
        const manager = this.datasource.manager

        this.logger.log(`Creating notification template: ${payload.name}`)

        const notification = manager.create(NotificationEntity, {
            name: payload.name,
            description: payload.description,
            eventKey: payload.eventKey,
            channel: payload.channel,
            title: payload.title ?? null,
            body: payload.body,
            active: payload.active ?? true,
        })

        return manager.save(notification)
    }
}
