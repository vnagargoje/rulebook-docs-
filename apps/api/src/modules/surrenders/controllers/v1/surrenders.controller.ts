import { ApiResource } from '@/decorators/api-resource.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import {
    Controller,
    ForbiddenException,
    Get,
    Inject,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetVehicleSurrenderDetailsQuery } from '@yugo/cqrs';
import { VehicleSurrenderDetailsResponse } from '../../dtos/responses';
import { AccessService, Actions } from '@yugo/nestjs-casl';
import { type Request } from 'express';
import { VehicleSurrenderSubject } from '@yugo/permissions';

@ApiTags('vehicle-surrender')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'vehicle-surrender', version: '1' })
export class V1VehicleSurrenderController {
    constructor(
        private readonly queryBus: QueryBus,
        @Inject(AccessService) private readonly accessService: AccessService,
    ) {}

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
}
