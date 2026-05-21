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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { type Static, Type } from '@sinclair/typebox';
import { CreateStationCommand, GetNearestSwapStationsQuery, UpdateStationCommand } from '@yugo/cqrs';
import { AccessService, Actions } from '@yugo/nestjs-casl';
import { StationEntity } from '@yugo/nestjs-database/entities';
import { StationSubject } from '@yugo/permissions';
import { type Request } from 'express';
import {
    FilterOperator,
    paginate,
    Paginate,
    PaginateConfig,
    type PaginateQuery,
} from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { CreateStationPayload, NearestSwapStationsPayload } from '../../dtos/payloads';
import { NearestSwapStationResponse, StationResponse } from '../../dtos/responses';

const PAGINATE_CONFIG: PaginateConfig<StationEntity> = {
    sortableColumns: ['id', 'name', 'createdAt'],
    relations: ['address', 'address.city', 'address.city.state', 'managers'],
    filterableColumns: {
        type: [FilterOperator.EQ],
        name: [FilterOperator.ILIKE],
        'managers.firstName': [FilterOperator.ILIKE],
        'managers.lastName': [FilterOperator.ILIKE],
        'managers.id': [FilterOperator.EQ],
    },
    defaultSortBy: [['createdAt', 'DESC']],
};

@ApiTags('stations')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'stations', version: '1' })
export class V1StationsController {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @Inject(AccessService) private readonly accessService: AccessService,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Get()
    @ApiResource(StationResponse, PAGINATE_CONFIG)
    async getManyStations(
        @Paginate() query: PaginateQuery,
        @Req() req: Request,
    ) {
        const queryBuilder = this.datasource.manager.createQueryBuilder(
            StationEntity,
            'station',
        );
        return paginate(query, queryBuilder, PAGINATE_CONFIG);
    }

    @Get(':id')
    @ApiResource(StationResponse)
    async getOneStation(@Param('id') id: string, @Req() req: Request) {
        const station = await this.datasource.manager.findOne(StationEntity, {
            where: { id },
            relations: [
                'address',
                'address.city',
                'address.city.state',
                'managers',
            ],
        });
        if (!station) {
            throw new NotFoundException('Station not found');
        }
        return station;
    }

    @ApiBody({ schema: NearestSwapStationsPayload as object })
    @ApiResource(Type.Array(NearestSwapStationResponse))
    @Post('nearest-swap')
    async getNearestSwapStations(
        @Body() body: Static<typeof NearestSwapStationsPayload>,
    ) {
        return this.queryBus.execute(
            new GetNearestSwapStationsQuery(body.latitude, body.longitude),
        );
    }

    @ApiBody({ schema: CreateStationPayload as object })
    @ApiResource(StationResponse)
    @Post()
    async createOneStation(
        @Body() body: Static<typeof CreateStationPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new StationSubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }
        return this.commandBus.execute(new CreateStationCommand(body));
    }

    @ApiBody({ schema: CreateStationPayload as object })
    @ApiResource(StationResponse)
    @Patch(':id')
    async updateOneStation(
        @Param('id') id: string,
        @Body() body: Static<typeof CreateStationPayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.create,
                new StationSubject(),
            )
        ) {
            throw new ForbiddenException('not allowed');
        }
        return this.commandBus.execute(new UpdateStationCommand(id, body));
    }
}
