import { ApiResource } from '@/decorators/api-resource.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Inject,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { type Static } from '@sinclair/typebox';
import {
    GetVehicleSurrenderDetailsQuery,
    SurrenderVehicleCommand,
} from '@yugo/cqrs';
import { AccessService, Actions } from '@yugo/nestjs-casl';
import { VehicleSurrenderEntity } from '@yugo/nestjs-database/entities';
import { VehicleSurrenderSubject } from '@yugo/permissions';
import { type Request } from 'express';
import {
    FilterOperator,
    Paginate,
    paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { SurrenderVehiclePayload } from '../../dtos/payloads';
import {
    SurrenderVehicleResponse,
    VehicleSurrenderDetailsResponse,
    VehicleSurrenderListResponse,
} from '../../dtos/responses';

const PAGINATE_CONFIG: PaginateConfig<VehicleSurrenderEntity> = {
    sortableColumns: ['createdAt'],
    defaultLimit: 50,
    defaultSortBy: [['createdAt', 'DESC']],
    filterableColumns: {
        vehicleId: [FilterOperator.EQ],
        bookingId: [FilterOperator.EQ],
    },
    relations: ['booking', 'vehicle'],
};

@ApiTags('vehicle-surrender')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'vehicle-surrender', version: '1' })
export class V1VehicleSurrenderController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @Inject(AccessService) private readonly accessService: AccessService,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    @ApiResource(VehicleSurrenderListResponse, PAGINATE_CONFIG)
    @Get()
    async getAllSurrenders(
        @Paginate() query: PaginateQuery,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.manage,
                new VehicleSurrenderSubject(),
            )
        ) {
            throw new ForbiddenException(
                'You are not allowed to perform this action',
            );
        }
        const qb = this.datasource.manager.createQueryBuilder(
            VehicleSurrenderEntity,
            'surrender',
        );
        return paginate(query, qb, PAGINATE_CONFIG);
    }

    @ApiResource(VehicleSurrenderDetailsResponse)
    @Get(':vehicleNumber')
    async getSurrenderDetails(
        @Param('vehicleNumber') vehicleNumber: string,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.manage,
                new VehicleSurrenderSubject(),
            )
        ) {
            throw new ForbiddenException(
                'You are not allowed to perform this action',
            );
        }
        return this.queryBus.execute(
            new GetVehicleSurrenderDetailsQuery(vehicleNumber),
        );
    }

    @ApiBody({ schema: SurrenderVehiclePayload as object })
    @ApiResource(SurrenderVehicleResponse)
    @Post(':vehicleNumber/surrender')
    async surrenderVehicle(
        @Param('vehicleNumber') vehicleNumber: string,
        @Body() body: Static<typeof SurrenderVehiclePayload>,
    ) {
        return this.commandBus.execute(
            new SurrenderVehicleCommand(
                vehicleNumber,
                body.penalty,
                body.miscCharges,
                body.refundAmount,
                body.notes ?? null,
            ),
        );
    }
}
