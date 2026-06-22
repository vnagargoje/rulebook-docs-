import { NotFoundException } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { NotificationEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { GetNotificationQuery } from '../../impl/notifications/get-notification.query.js'

@QueryHandler(GetNotificationQuery)
export class GetNotificationHandler implements IQueryHandler<GetNotificationQuery> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(query: GetNotificationQuery) {
        const { id } = query
        const manager = this.datasource.manager

        const notification = await manager.findOne(NotificationEntity, { where: { id } })
        if (!notification) {
            throw new NotFoundException('Notification template not found')
        }

        return notification
    }
}
