import { Logger } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { SwapStationEntity } from '@yugo/nestjs-database/entities'
import { DataSource } from 'typeorm'
import { GetNearestSwapStationsQuery } from 'src/queries/impl'

@QueryHandler(GetNearestSwapStationsQuery)
export class GetNearestSwapStationsHandler implements IQueryHandler<GetNearestSwapStationsQuery> {
    private readonly logger = new Logger(GetNearestSwapStationsHandler.name)

    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    async execute(query: GetNearestSwapStationsQuery) {
        const { latitude, longitude } = query
        const manager = this.datasource.manager

        const distanceExpression = `(
            6371 * acos(
                LEAST(1.0,
                    sin(radians(:lat)) * sin(radians(CAST(station.latitude AS FLOAT))) +
                    cos(radians(:lat)) * cos(radians(CAST(station.latitude AS FLOAT))) *
                    cos(radians(CAST(station.longitude AS FLOAT)) - radians(:lng))
                )
            )
        )`

        const { entities, raw } = await manager
            .createQueryBuilder(SwapStationEntity, 'station')
            .addSelect(distanceExpression, 'distance_km')
            .leftJoinAndSelect('station.address', 'address')
            .leftJoinAndSelect('address.city', 'city')
            .leftJoinAndSelect('city.state', 'state')
            .where('station.latitude IS NOT NULL')
            .andWhere('station.longitude IS NOT NULL')
            .andWhere('station.active = :active', { active: true })
            .orderBy(distanceExpression, 'ASC')
            .limit(10)
            .setParameters({ lat: latitude, lng: longitude })
            .getRawAndEntities()

        return entities.map((station, index) => ({
            ...station,
            distanceKm: parseFloat(raw[index]?.distance_km ?? '0'),
        }))
    }
}
