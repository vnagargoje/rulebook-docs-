import { ApiResource } from '@/decorators/api-resource.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import {
    Controller,
    Get,
    NotFoundException,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { TopUpEntity } from '@yugo/nestjs-database/entities';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { TopUpResponse } from '../../dtos/responses';
import { Public } from '@/decorators/public.decorator';

const PAGINATE_CONFIG: PaginateConfig<TopUpEntity> = {
    sortableColumns: ['id', 'name', 'price', 'createdAt'],
    searchableColumns: ['name', 'description'],
    defaultLimit: 50,
    filterableColumns: {
        active: [FilterOperator.EQ],
        price: [FilterOperator.GTE, FilterOperator.LTE],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('top-ups')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'top-ups', version: '1' })
export class V1TopUpsController {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    @Public()
    @ApiResource(TopUpResponse, PAGINATE_CONFIG)
    @Get()
    async getTopUps(@Paginate() query: PaginateQuery) {
        const qb = this.datasource.manager.createQueryBuilder(
            TopUpEntity,
            'topUp',
        );

        if (query.filter?.active) {
            const val = Array.isArray(query.filter.active) ? query.filter.active[0] : query.filter.active;
            const isActive = val === '$eq:true' || val === 'true';
            qb.andWhere('topUp.active = :isActive', { isActive });
            delete query.filter.active;
        }

        return paginate(query, qb, PAGINATE_CONFIG);
    }

    @Public()
    @ApiResource(TopUpResponse)
    @Get(':id')
    async getTopUpById(@Param('id') id: string) {
        const topUp = await this.datasource.manager.findOne(TopUpEntity, {
            where: { id },
        });
        if (!topUp) {
            throw new NotFoundException('Top-up not found');
        }
        return topUp;
    }
}
