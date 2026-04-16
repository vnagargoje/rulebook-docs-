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
import { PlanEntity } from '@yugo/nestjs-database/entities';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { PlanResponse } from '../../dtos/responses';

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
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    @Get()
    @ApiResource(PlanResponse, PAGINATE_CONFIG)
    async getPlans(@Paginate() query: PaginateQuery) {
        const qb = this.datasource.manager
            .createQueryBuilder(PlanEntity, 'plan')
            .where('plan.active = :active', { active: true });
        return paginate(query, qb, PAGINATE_CONFIG);
    }

    @Get(':id')
    @ApiResource(PlanResponse)
    async getPlanById(@Param('id') id: string) {
        const plan = await this.datasource.manager.findOne(PlanEntity, {
            where: { id },
        });
        if (!plan) {
            throw new NotFoundException('Plan not found');
        }
        return plan;
    }
}
