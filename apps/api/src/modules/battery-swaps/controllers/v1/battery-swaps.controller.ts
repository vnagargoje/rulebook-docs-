import { ApiResource } from '@/decorators/api-resource.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { type Static } from '@sinclair/typebox';
import {
    ExecuteBatterySwapCommand,
    VerifyInwardBatteryCommand,
} from '@yugo/cqrs';
import { AccessService } from '@yugo/nestjs-casl';
import { BatterySwapHistoryEntity } from '@yugo/nestjs-database/entities';
import { Actions, BatterySwapSubject } from '@yugo/permissions';
import { type Request } from 'express';
import {
    FilterOperator,
    paginate,
    Paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import {
    ExecuteSwapPayload,
    VerifyInwardBatteryPayload,
} from '../../dtos/payloads';
import {
    BatterySwapHistoryResponse,
    BatterySwapResponse,
    InwardVerificationResponse,
} from '../../dtos/responses';

const PAGINATE_CONFIG: PaginateConfig<BatterySwapHistoryEntity> = {
    sortableColumns: ['id', 'createdAt'],
    relations: [
        'oldBattery',
        'newBattery',
        'fromStation',
        'toStation',
        'userPlan',
        'userPlan.user',
    ],
    filterableColumns: {
        bookingId: [FilterOperator.EQ],
        userPlanId: [FilterOperator.EQ],
        swappedById: [FilterOperator.EQ],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('battery-swaps')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'battery-swaps', version: '1' })
export class V1BatterySwapsController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly commandBus: CommandBus,
        private readonly accessService: AccessService,
    ) {}

    @ApiBody({ schema: VerifyInwardBatteryPayload as object })
    @ApiResource(InwardVerificationResponse)
    @Post('verify-inward')
    async verifyInwardBattery(
        @Body() body: Static<typeof VerifyInwardBatteryPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new BatterySwapSubject(),
            )
        ) {
            throw new ForbiddenException(
                'Not allowed to perform battery swaps',
            );
        }
        return this.commandBus.execute(
            new VerifyInwardBatteryCommand(body.bookingId, body.batteryQrId),
        );
    }

    @ApiBody({ schema: ExecuteSwapPayload as object })
    @ApiResource(BatterySwapResponse)
    @Post('execute')
    async executeSwap(
        @Body() body: Static<typeof ExecuteSwapPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new BatterySwapSubject(),
            )
        ) {
            throw new ForbiddenException(
                'Not allowed to perform battery swaps',
            );
        }
        const user = req.user as { id: string };
        return this.commandBus.execute(
            new ExecuteBatterySwapCommand(
                body.bookingId,
                body.newBatteryQrId,
                body.stationId,
                user.id,
            ),
        );
    }

    @ApiResource(BatterySwapHistoryResponse, PAGINATE_CONFIG)
    @Get('history')
    async getSwapHistory(
        @Paginate() query: PaginateQuery,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.read,
                new BatterySwapSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to view swap history');
        }
        const qb = this.datasource.manager.createQueryBuilder(
            BatterySwapHistoryEntity,
            'swap',
        );
        return paginate(query, qb, PAGINATE_CONFIG);
    }
}
