import { ApiResource } from '@/decorators/api-resource.decorator';
import { Public } from '@/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { CityEntity } from '@yugo/nestjs-database/entities';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { CityResponse } from '../../dtos/responses';

const PAGINATE_CONFIG: PaginateConfig<CityEntity> = {
    sortableColumns: ['id', 'name'],
    searchableColumns: ['name'],
    filterableColumns: {
        'state.id': [FilterOperator.IN, FilterOperator.EQ],
    },
    relations: {
        state: true,
    },
};

@ApiTags('geographic data')
@Public()
@Controller({ path: 'cities', version: '1' })
export class V1CitiesController {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    @ApiResource(CityResponse, PAGINATE_CONFIG)
    @Get()
    async listManyCities(@Paginate() query: PaginateQuery) {
        const queryBuilder = this.datasource.createQueryBuilder(
            CityEntity,
            'city',
        );
        return paginate(query, queryBuilder, PAGINATE_CONFIG);
    }
}
