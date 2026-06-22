import { ApiResource } from '@/decorators/api-resource.decorator';
import { AuthenticatedUser } from '@/decorators/auth-user.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import { type ContextUserType } from '@/types/context-user';
import { type Static } from '@sinclair/typebox';
import {
    Controller,
    Get,
    UseGuards,
    ForbiddenException,
    Req,
    Inject,
    Patch,
    Param,
    Body,
    Post,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
    GetKycStatusQuery,
    UpdateKycStatusCommand,
    ApplyManualKycCommand,
} from '@yugo/cqrs';
import { AccessService } from '@yugo/nestjs-casl';
import { Actions, KycSubject } from '@yugo/permissions';
import { KycStatus } from '@yugo/shared';
import { type Request } from 'express';
import {
    KycStatusResponse,
    AllKycResponse,
    GenericKycResponse,
} from '../../dtos/responses.js';
import {
    UpdateKycStatusPayload,
    ApplyManualKycPayload,
} from '../../dtos/payloads.js';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
    Paginate,
    PaginateConfig,
    paginate,
    type PaginateQuery,
    FilterOperator,
} from 'nestjs-paginate';
import { UserKycEntity } from '@yugo/nestjs-database/entities';

const PAGINATE_CONFIG: PaginateConfig<UserKycEntity> = {
    sortableColumns: ['id', 'createdAt', 'updatedAt'],
    searchableColumns: ['documentId', 'userId'],
    defaultLimit: 50,
    filterableColumns: {
        documentId: [FilterOperator.EQ, FilterOperator.ILIKE],
        userId: [FilterOperator.EQ],
        status: [FilterOperator.EQ, FilterOperator.IN],
        type: [FilterOperator.EQ, FilterOperator.IN],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('kyc')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'kyc', version: '1' })
export class KycController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        @Inject(AccessService) private readonly accessService: AccessService,
    ) {}

    @ApiResource(KycStatusResponse)
    @Get('status')
    async getStatus(@AuthenticatedUser() user: ContextUserType) {
        return this.queryBus.execute(new GetKycStatusQuery(user.id));
    }

    @ApiResource(AllKycResponse, PAGINATE_CONFIG)
    @Get('all')
    async getAllKycs(@Paginate() query: PaginateQuery, @Req() req: Request) {
        const isSystemAdmin = this.accessService.hasAbility(
            req.user,
            Actions.manage,
            new KycSubject(),
        );

        const queryBuilder = this.datasource.manager.createQueryBuilder(
            UserKycEntity,
            'kyc',
        );

        if (!isSystemAdmin) {
            queryBuilder.where('kyc.userId = :userId', { userId: req.user.id });
        }

        return paginate(query, queryBuilder, PAGINATE_CONFIG);
    }

    @ApiBody({ schema: UpdateKycStatusPayload })
    @ApiResource(GenericKycResponse)
    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() body: Static<typeof UpdateKycStatusPayload>,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        if (
            !this.accessService.hasAbility(
                user,
                Actions.manage,
                new KycSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to update KYC status');
        }
        return this.commandBus.execute(
            new UpdateKycStatusCommand(
                id,
                body.status as KycStatus,
                body.notes,
            ),
        );
    }

    @ApiBody({ schema: ApplyManualKycPayload })
    @ApiResource(GenericKycResponse)
    @Post(':id/apply-manual')
    async applyManual(
        @Param('id') id: string,
        @AuthenticatedUser() user: ContextUserType,
        @Body() body: Static<typeof ApplyManualKycPayload>,
    ) {
        return this.commandBus.execute(
            new ApplyManualKycCommand(user.id, id, body.notes),
        );
    }
}
