import { ApiResource } from '@/decorators/api-resource.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Inject,
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
import { AccessService, Actions } from '@yugo/nestjs-casl';
import { BatteryEntity } from '@yugo/nestjs-database/entities';
import { type Request } from 'express';
import {
    FilterOperator,
    paginate,
    Paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { BatteryResponse } from '../../dtos/responses';
import {
    CreateBatteryPayload,
    UpdateBatteryPayload,
} from '../../dtos/payloads';
import { type Static } from '@sinclair/typebox';
import { BatterySubject } from '@yugo/permissions';
import { CreateBatteryCommand, UpdateBatteryCommand } from '@yugo/cqrs';

const PAGINATE_CONFIG: PaginateConfig<BatteryEntity> = {
    sortableColumns: ['id', 'batteryQrId', 'createdAt'],
    relations: ['station'],
    filterableColumns: {
        batteryQrId: [FilterOperator.ILIKE],
        gpsId: [FilterOperator.ILIKE],
        stationId: [FilterOperator.EQ],
        'station.name': [FilterOperator.ILIKE],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('batteries')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'batteries', version: '1' })
export class V1BatteriesController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @Inject(AccessService) private readonly accessService: AccessService,
        private readonly commandBus: CommandBus,
    ) {}

    @Get()
    @ApiResource(BatteryResponse, PAGINATE_CONFIG)
    async getManyBatteries(
        @Paginate() query: PaginateQuery,
        @Req() req: Request,
    ) {
        const queryBuilder = this.datasource.manager.createQueryBuilder(
            BatteryEntity,
            'battery',
        );
        return paginate(query, queryBuilder, PAGINATE_CONFIG);
    }

    @Get(':id')
    @ApiResource(BatteryResponse)
    async getOneBattery(@Param('id') id: string, @Req() req: Request) {
        const battery = await this.datasource.manager.findOne(BatteryEntity, {
            where: { id },
            relations: ['station'],
        });
        if (!battery) {
            throw new NotFoundException('Battery not found');
        }
        return battery;
    }

    @ApiBody({ schema: CreateBatteryPayload as object })
    @ApiResource(BatteryResponse)
    @Post()
    async createOneBattery(
        @Body() body: Static<typeof CreateBatteryPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new BatterySubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }
        return this.commandBus.execute(new CreateBatteryCommand(body));
    }

    @ApiBody({ schema: UpdateBatteryPayload as object })
    @ApiResource(BatteryResponse)
    @Patch(':id')
    async updateOneBattery(
        @Param('id') id: string,
        @Body() body: Static<typeof UpdateBatteryPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.update,
                new BatterySubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }
        return this.commandBus.execute(new UpdateBatteryCommand(id, body));
    }
}
