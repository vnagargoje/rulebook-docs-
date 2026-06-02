import { ApiResource } from '@/decorators/api-resource.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { PlanEntity } from '@yugo/nestjs-database/entities';
import { type Request } from 'express';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { PlanResponse } from '../../dtos/responses';
import { Public } from '@/decorators/public.decorator';
import { QueryBus } from '@nestjs/cqrs';
import { GetAccuratePlanPricesQuery } from '@yugo/cqrs';

const PAGINATE_CONFIG: PaginateConfig<PlanEntity> = {
    sortableColumns: ['id', 'name', 'price', 'createdAt'],
    searchableColumns: ['name', 'description'],
    defaultLimit: 50,
    filterableColumns: {
        active: [FilterOperator.EQ],
        price: [FilterOperator.GTE, FilterOperator.LTE],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('plans')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'plans', version: '1' })
export class V1PlansController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly queryBus: QueryBus,
    ) {}

    @Public()
    @Get()
    @ApiResource(PlanResponse, PAGINATE_CONFIG)
    async getPlans(@Paginate() query: PaginateQuery, @Req() req: Request) {
        const qb = this.datasource.manager.createQueryBuilder(
            PlanEntity,
            'plan',
        );

        if (query.filter?.active) {
            const val = Array.isArray(query.filter.active) ? query.filter.active[0] : query.filter.active;
            const isActive = val === '$eq:true' || val === 'true';
            qb.andWhere('plan.active = :isActive', { isActive });
            delete query.filter.active;
        }

        const paginated = await paginate(query, qb, PAGINATE_CONFIG);

        paginated.data = await this.queryBus.execute(
            new GetAccuratePlanPricesQuery(paginated.data, req.user?.id),
        );

        return paginated;
    }

    @Public()
    @Get(':id')
    @ApiResource(PlanResponse)
    async getPlanById(@Param('id') id: string, @Req() req: Request) {
        const plan = await this.datasource.manager.findOne(PlanEntity, {
            where: { id },
        });
        if (!plan) {
            throw new NotFoundException('Plan not found');
        }

        const [transformed] = await this.queryBus.execute(
            new GetAccuratePlanPricesQuery([plan], req.user?.id),
        );

        return transformed;
    }
}
