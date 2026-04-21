import { ApiResource } from '@/decorators/api-resource.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { type Static } from '@sinclair/typebox';
import {
    DispatchBatteriesCommand,
    ReceiveBatteriesCommand,
    UpdateBatteryStatusCommand,
} from '@yugo/cqrs';
import { AccessService, Actions } from '@yugo/nestjs-casl';
import {
    BatteryEntity,
    BatteryTransportEntity,
} from '@yugo/nestjs-database/entities';
import { BatteryTransportSubject } from '@yugo/permissions';
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
    DispatchBatteriesPayload,
    ReceiveBatteriesPayload,
    UpdateBatteryStatusPayload,
} from '../../dtos/payloads';
import {
    BatteryTransportResponse,
    BatteryWithStatusResponse,
} from '../../dtos/responses';

const PAGINATE_CONFIG: PaginateConfig<BatteryTransportEntity> = {
    sortableColumns: ['id', 'createdAt', 'status'],
    relations: ['fromStation', 'toStation', 'vehicle'],
    filterableColumns: {
        fromStationId: [FilterOperator.EQ],
        toStationId: [FilterOperator.EQ],
        vehicleId: [FilterOperator.EQ],
        status: [FilterOperator.EQ],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('battery-transports')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'battery-transports', version: '1' })
export class V1BatteryTransportsController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly commandBus: CommandBus,
        private readonly accessService: AccessService,
    ) {}

    @ApiBody({ schema: DispatchBatteriesPayload as object })
    @ApiResource(BatteryTransportResponse)
    @Post('dispatch')
    async dispatchBatteries(
        @Body() body: Static<typeof DispatchBatteriesPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new BatteryTransportSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to dispatch batteries');
        }
        const user = req.user as { id: string };
        return this.commandBus.execute(
            new DispatchBatteriesCommand(
                body.fromStationId,
                body.toStationId,
                body.vehicleId,
                body.batteryQrIds,
                user.id,
            ),
        );
    }

    @ApiBody({ schema: ReceiveBatteriesPayload as object })
    @ApiResource(BatteryTransportResponse)
    @Post(':id/receive')
    async receiveBatteries(
        @Param('id') id: string,
        @Body() body: Static<typeof ReceiveBatteriesPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new BatteryTransportSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to receive batteries');
        }
        const user = req.user as { id: string };
        return this.commandBus.execute(
            new ReceiveBatteriesCommand(id, body.batteryQrIds, user.id),
        );
    }

    @ApiBody({ schema: UpdateBatteryStatusPayload as object })
    @ApiResource(BatteryWithStatusResponse)
    @Patch('batteries/:batteryId/status')
    async updateBatteryStatus(
        @Param('batteryId') batteryId: string,
        @Body() body: Static<typeof UpdateBatteryStatusPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new BatteryTransportSubject(),
            )
        ) {
            throw new ForbiddenException(
                'Not allowed to update battery status',
            );
        }
        return this.commandBus.execute(
            new UpdateBatteryStatusCommand(batteryId, body.status),
        );
    }

    @Get()
    @ApiResource(BatteryTransportResponse, PAGINATE_CONFIG)
    async getManyMovements(
        @Paginate() query: PaginateQuery,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.read,
                new BatteryTransportSubject(),
            )
        ) {
            throw new ForbiddenException(
                'Not allowed to view battery movements',
            );
        }
        const qb = this.datasource.manager.createQueryBuilder(
            BatteryTransportEntity,
            'transport',
        );
        return paginate(query, qb, PAGINATE_CONFIG);
    }

    @Get(':id')
    @ApiResource(BatteryTransportResponse)
    async getOneMovement(@Param('id') id: string, @Req() req: Request) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.read,
                new BatteryTransportSubject(),
            )
        ) {
            throw new ForbiddenException(
                'Not allowed to view battery movements',
            );
        }
        const transport = await this.datasource.manager.findOne(
            BatteryTransportEntity,
            {
                where: { id },
                relations: ['fromStation', 'toStation', 'vehicle'],
            },
        );
        if (!transport) {
            throw new NotFoundException('Transport not found');
        }
        return transport;
    }

    @Get(':id/batteries')
    @ApiResource(BatteryWithStatusResponse)
    async getMovementBatteries(@Param('id') id: string, @Req() req: Request) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.read,
                new BatteryTransportSubject(),
            )
        ) {
            throw new ForbiddenException(
                'Not allowed to view battery movements',
            );
        }
        const transport = await this.datasource.manager.findOne(
            BatteryTransportEntity,
            { where: { id } },
        );
        if (!transport) {
            throw new NotFoundException('Transport not found');
        }
        return this.datasource.manager.find(BatteryEntity, {
            where: transport.batteryIds.map((batteryId) => ({ id: batteryId })),
            relations: ['station'],
        });
    }
}
