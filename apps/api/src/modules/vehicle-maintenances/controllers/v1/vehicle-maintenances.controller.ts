import { ApiResource } from '@/decorators/api-resource.decorator.js';
import { AppAuthGuard } from '@/guards/app.guard.js';
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
import { VehicleMaintenanceEntity } from '@yugo/nestjs-database/entities';
import { type Request } from 'express';
import {
    FilterOperator,
    paginate,
    Paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { VehicleMaintenanceResponse } from '../../dtos/responses.js';
import {
    CreateVehicleMaintenancePayload,
    UpdateVehicleMaintenancePayload,
} from '../../dtos/payloads.js';
import { type Static } from '@sinclair/typebox';
import { VehicleMaintenanceSubject } from '@yugo/permissions';
import {
    CreateVehicleMaintenanceCommand,
    UpdateVehicleMaintenanceCommand,
} from '@yugo/cqrs';

const PAGINATE_CONFIG: PaginateConfig<VehicleMaintenanceEntity> = {
    sortableColumns: ['id', 'expectedFixDate', 'createdAt'],
    relations: ['vehicle'],
    filterableColumns: {
        status: [FilterOperator.EQ],
        vehicleId: [FilterOperator.EQ],
        'vehicle.vehicleNumber': [FilterOperator.ILIKE],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('maintenance')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'maintenance', version: '1' })
export class V1VehicleMaintenancesController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @Inject(AccessService) private readonly accessService: AccessService,
        private readonly commandBus: CommandBus,
    ) {}

    @Get()
    @ApiResource(VehicleMaintenanceResponse, PAGINATE_CONFIG)
    async getManyMaintenances(
        @Paginate() query: PaginateQuery,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.read,
                new VehicleMaintenanceSubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }
        const queryBuilder = this.datasource.manager.createQueryBuilder(
            VehicleMaintenanceEntity,
            'maintenance',
        );
        return paginate(query, queryBuilder, PAGINATE_CONFIG);
    }

    @Get(':id')
    @ApiResource(VehicleMaintenanceResponse)
    async getOneMaintenance(@Param('id') id: string, @Req() req: Request) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.read,
                new VehicleMaintenanceSubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }
        const record = await this.datasource.manager.findOne(
            VehicleMaintenanceEntity,
            {
                where: { id },
                relations: ['vehicle'],
            },
        );
        if (!record) {
            throw new NotFoundException('Maintenance record not found');
        }
        return record;
    }

    @ApiBody({ schema: CreateVehicleMaintenancePayload as object })
    @ApiResource(VehicleMaintenanceResponse)
    @Post()
    async createOneMaintenance(
        @Body() body: Static<typeof CreateVehicleMaintenancePayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new VehicleMaintenanceSubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }
        return this.commandBus.execute(
            new CreateVehicleMaintenanceCommand(body),
        );
    }

    @ApiBody({ schema: UpdateVehicleMaintenancePayload as object })
    @ApiResource(VehicleMaintenanceResponse)
    @Patch(':id')
    async updateOneMaintenance(
        @Param('id') id: string,
        @Body() body: Static<typeof UpdateVehicleMaintenancePayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.update,
                new VehicleMaintenanceSubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }
        return this.commandBus.execute(
            new UpdateVehicleMaintenanceCommand(id, body),
        );
    }
}
