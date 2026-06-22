import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { NotificationEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { paginate, FilterOperator, PaginateConfig } from 'nestjs-paginate'
import { GetNotificationsQuery } from '../../impl/notifications/get-notifications.query.js'

export const NOTIFICATION_PAGINATE_CONFIG: PaginateConfig<NotificationEntity> = {
    sortableColumns: ['id', 'name', 'eventKey', 'channel', 'active', 'createdAt'],
    searchableColumns: ['name', 'description', 'eventKey', 'title', 'body'],
    defaultLimit: 50,
    filterableColumns: {
        active: [FilterOperator.EQ],
        channel: [FilterOperator.EQ],
        eventKey: [FilterOperator.EQ],
    },
    defaultSortBy: [['createdAt', 'DESC']],
}

@QueryHandler(GetNotificationsQuery)
export class GetNotificationsHandler implements IQueryHandler<GetNotificationsQuery> {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(query: GetNotificationsQuery) {
        const { query: paginateQuery } = query
        const manager = this.datasource.manager

        const qb = manager.createQueryBuilder(NotificationEntity, 'notification')

        return paginate(paginateQuery, qb, NOTIFICATION_PAGINATE_CONFIG)
    }
}
