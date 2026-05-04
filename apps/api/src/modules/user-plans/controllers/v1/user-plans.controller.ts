import { ApiResource } from '@/decorators/api-resource.decorator';
import { AuthenticatedUser } from '@/decorators/auth-user.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import { type ContextUserType } from '@/types/context-user';
import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Inject,
    NotFoundException,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { AccessService, Actions } from '@yugo/nestjs-casl';
import { UserPlanSubject } from '@yugo/permissions';
import { type Static } from '@sinclair/typebox';
import {
    ApplyTopUpCommand,
    PurchasePlanCommand,
    PurchaseTopUpCommand,
    VerifyPaymentCommand,
    VerifyTopUpPaymentCommand,
} from '@yugo/cqrs';
import { GetUserPlanByQrQuery } from '@yugo/cqrs';
import { UserPlanEntity } from '@yugo/nestjs-database/entities';
import { type Request } from 'express';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import {
    ApplyTopUpPayload,
    PurchasePlanPayload,
    PurchaseTopUpPayload,
    VerifyPaymentPayload,
    VerifyTopUpPaymentPayload,
} from '../../dtos/payloads';
import {
    PurchasePlanOrderResponse,
    PurchaseTopUpOrderResponse,
    UserPlanQrScanResponse,
    UserPlanResponse,
} from '../../dtos/responses';

const PAGINATE_CONFIG: PaginateConfig<UserPlanEntity> = {
    sortableColumns: ['id', 'status', 'createdAt'],
    defaultLimit: 50,
    filterableColumns: {
        status: [FilterOperator.EQ, FilterOperator.IN],
    },
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['qrCode'],
};

@ApiTags('user-plans')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'user-plans', version: '1' })
export class V1UserPlansController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        @Inject(AccessService) private readonly accessService: AccessService,
    ) {}

    @ApiResource(UserPlanResponse, PAGINATE_CONFIG)
    @Get()
    async getMyPlans(
        @Paginate() query: PaginateQuery,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        const qb = this.datasource.manager
            .createQueryBuilder(UserPlanEntity, 'userPlan')
            .where('userPlan.userId = :userId', { userId: user.id });
        return paginate(query, qb, PAGINATE_CONFIG);
    }

    @ApiResource(UserPlanResponse)
    @Get(':id')
    async getMyPlanById(
        @Param('id') id: string,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        const userPlan = await this.datasource.manager.findOne(UserPlanEntity, {
            where: { id, userId: user.id },
        });
        if (!userPlan) {
            throw new NotFoundException('User plan not found');
        }
        return userPlan;
    }

    @ApiBody({ schema: PurchasePlanPayload })
    @ApiResource(PurchasePlanOrderResponse)
    @Post('purchase')
    async purchasePlan(
        @Body() body: Static<typeof PurchasePlanPayload>,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        return this.commandBus.execute(
            new PurchasePlanCommand(user.id, body.planId),
        );
    }

    @ApiBody({ schema: VerifyPaymentPayload })
    @ApiResource(UserPlanResponse)
    @Post('verify-payment')
    async verifyPayment(
        @Body() body: Static<typeof VerifyPaymentPayload>,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        return this.commandBus.execute(
            new VerifyPaymentCommand(
                user.id,
                body.razorpayOrderId,
                body.razorpayPaymentId,
                body.razorpaySignature,
            ),
        );
    }

    @ApiBody({ schema: ApplyTopUpPayload })
    @ApiResource(UserPlanResponse)
    @Post('top-up')
    async applyTopUp(
        @Body() body: Static<typeof ApplyTopUpPayload>,
        @AuthenticatedUser() user: ContextUserType,
        @Req() req: Request,
    ) {
        // Administrative endpoint – only system_admin may apply a top-up for free.
        if (!this.accessService.hasAbility(req.user, Actions.manage, new UserPlanSubject())) {
            throw new ForbiddenException('not allowed');
        }
        return this.commandBus.execute(
            new ApplyTopUpCommand(user.id, body.topUpId, body.userPlanId),
        );
    }

    @ApiBody({ schema: PurchaseTopUpPayload })
    @ApiResource(PurchaseTopUpOrderResponse)
    @Post('top-up/purchase')
    async purchaseTopUp(
        @Body() body: Static<typeof PurchaseTopUpPayload>,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        return this.commandBus.execute(
            new PurchaseTopUpCommand(user.id, body.topUpId, body.userPlanId),
        );
    }

    @ApiBody({ schema: VerifyTopUpPaymentPayload })
    @ApiResource(UserPlanResponse)
    @Post('top-up/verify-payment')
    async verifyTopUpPayment(
        @Body() body: Static<typeof VerifyTopUpPaymentPayload>,
        @AuthenticatedUser() user: ContextUserType,
    ) {
        return this.commandBus.execute(
            new VerifyTopUpPaymentCommand(
                user.id,
                body.razorpayOrderId,
                body.razorpayPaymentId,
                body.razorpaySignature,
                body.topUpId,
                body.userPlanId,
            ),
        );
    }

    @ApiResource(UserPlanQrScanResponse)
    @Get(':id/scan')
    async scanQr(@Param('id') id: string) {
        return this.queryBus.execute(new GetUserPlanByQrQuery(id));
    }
}
