import { PaginateQuery } from 'nestjs-paginate'

export class GetNotificationsQuery {
    constructor(public readonly query: PaginateQuery) {}
}
