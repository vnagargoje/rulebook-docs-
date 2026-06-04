import { ApiResource } from '@/decorators/api-resource.decorator';
import { AuthenticatedUser } from '@/decorators/auth-user.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import { type ContextUserType } from '@/types/context-user';
import {
    Controller,
    Get,
    NotFoundException,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { SystemRoles } from '@yugo/shared';
import { TransactionEntity } from '@yugo/nestjs-database/entities';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { TransactionResponse } from '../../dtos/responses';

const PAGINATE_CONFIG: PaginateConfig<TransactionEntity> = {
    sortableColumns: ['id', 'status', 'amount', 'createdAt'],
    defaultLimit: 20,
    maxLimit: 10000,
    filterableColumns: {
        status: [FilterOperator.EQ, FilterOperator.IN],
        createdAt: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'transactions', version: '1' })
export class V1TransactionsController {
    constructor(@InjectDataSource() private readonly datasource: DataSource) {}

    @ApiResource(TransactionResponse, PAGINATE_CONFIG)
    @Get()
    async getTransactions(
        @Paginate() query: PaginateQuery,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        const isAdmin = user.roles.includes(SystemRoles.SYSTEM_ADMIN);
        const qb = this.datasource.manager
            .createQueryBuilder(TransactionEntity, 'transaction')
            .innerJoinAndSelect('transaction.userPlan', 'userPlan')
            .leftJoinAndSelect('userPlan.user', 'user')
            .leftJoinAndSelect('transaction.userTopUp', 'userTopUp');
        if (!isAdmin) {
            qb.where('userPlan.userId = :userId', { userId: user.id });
        }
        return paginate(query, qb, PAGINATE_CONFIG);
    }

    @ApiResource(TransactionResponse)
    @Get(':id')
    async getTransactionById(
        @Param('id') id: string,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        const isAdmin = user.roles.includes(SystemRoles.SYSTEM_ADMIN);
        const qb = this.datasource.manager
            .createQueryBuilder(TransactionEntity, 'transaction')
            .innerJoinAndSelect('transaction.userPlan', 'userPlan')
            .leftJoinAndSelect('userPlan.user', 'user')
            .leftJoinAndSelect('transaction.userTopUp', 'userTopUp')
            .where('transaction.id = :id', { id });
        if (!isAdmin) {
            qb.andWhere('userPlan.userId = :userId', { userId: user.id });
        }
        const transaction = await qb.getOne();
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }
        return transaction;
    }
}
