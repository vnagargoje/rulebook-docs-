import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { StateEntity } from '@yugo/nestjs-database/entities';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { ApiResource } from '@/decorators/api-resource.decorator';
import { Public } from '@/decorators/public.decorator';
import { StateResponse } from '../../dtos/responses';

const PAGINATE_CONFIG: PaginateConfig<StateEntity> = {
    sortableColumns: ['id', 'name'],
    searchableColumns: ['name'],
    filterableColumns: {
        'country.code': [FilterOperator.IN, FilterOperator.EQ],
    },
    relations: {
        cities: true,
        country: true,
    },
};

@ApiTags('geographic data')
@Public()
@Controller({ path: 'states', version: '1' })
export class V1StatesController {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    @ApiResource(StateResponse, PAGINATE_CONFIG)
    @Get()
    async listManyStates(@Paginate() query: PaginateQuery) {
        const queryBuilder = this.datasource.createQueryBuilder(
            StateEntity,
            'state',
        );
        return paginate(query, queryBuilder, PAGINATE_CONFIG);
    }
}
