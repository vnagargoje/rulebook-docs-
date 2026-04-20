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
import { VehicleEntity } from '@yugo/nestjs-database/entities';
import { type Request } from 'express';
import {
    FilterOperator,
    paginate,
    Paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { VehicleResponse } from '../../dtos/responses';
import {
    CreateVehiclePayload,
    UpdateVehiclePayload,
} from '../../dtos/payloads';
import { type Static } from '@sinclair/typebox';
import { VehicleSubject } from '@yugo/permissions';
import { CreateVehicleCommand, UpdateVehicleCommand } from '@yugo/cqrs';

const PAGINATE_CONFIG: PaginateConfig<VehicleEntity> = {
    sortableColumns: ['id', 'vehicleNumber', 'createdAt'],
    relations: ['station'],
    filterableColumns: {
        type: [FilterOperator.EQ],
        vehicleNumber: [FilterOperator.ILIKE],
        gpsId: [FilterOperator.ILIKE],
        stationId: [FilterOperator.EQ, FilterOperator.NULL],
        'station.name': [FilterOperator.ILIKE],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'vehicles', version: '1' })
export class V1VehiclesController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @Inject(AccessService) private readonly accessService: AccessService,
        private readonly commandBus: CommandBus,
    ) {}

    @Get()
    @ApiResource(VehicleResponse, PAGINATE_CONFIG)
    async getManyVehicles(
        @Paginate() query: PaginateQuery,
        @Req() req: Request,
    ) {
        const queryBuilder = this.datasource.manager.createQueryBuilder(
            VehicleEntity,
            'vehicle',
        );
        return paginate(query, queryBuilder, PAGINATE_CONFIG);
    }

    @Get(':id')
    @ApiResource(VehicleResponse)
    async getOneVehicle(@Param('id') id: string, @Req() req: Request) {
        const vehicle = await this.datasource.manager.findOne(VehicleEntity, {
            where: { id },
            relations: ['station'],
        });
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }
        return vehicle;
    }

    @ApiBody({ schema: CreateVehiclePayload as object })
    @ApiResource(VehicleResponse)
    @Post()
    async createOneVehicle(
        @Body() body: Static<typeof CreateVehiclePayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new VehicleSubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }
        return this.commandBus.execute(new CreateVehicleCommand(body));
    }

    @ApiBody({ schema: UpdateVehiclePayload as object })
    @ApiResource(VehicleResponse)
    @Patch(':id')
    async updateOneVehicle(
        @Param('id') id: string,
        @Body() body: Static<typeof UpdateVehiclePayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.update,
                new VehicleSubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }
        return this.commandBus.execute(new UpdateVehicleCommand(id, body));
    }
}
