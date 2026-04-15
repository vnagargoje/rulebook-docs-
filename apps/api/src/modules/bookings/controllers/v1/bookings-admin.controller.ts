import { ApiResource } from '@/decorators/api-resource.decorator';
import { AppAuthGuard } from '@/guards/app.guard';
import {
    Body,
    Controller,
    ForbiddenException,
    Param,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { type Static } from '@sinclair/typebox';
import { type Request } from 'express';
import { AccessService } from '@yugo/nestjs-casl';
import { AssignVehicleToBookingCommand } from '@yugo/cqrs';
import { Actions, BookingSubject } from '@yugo/permissions';
import { AssignVehiclePayload } from '../../dtos/payloads';
import { BookingResponse } from '../../dtos/responses';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(AppAuthGuard)
@Controller({ path: 'admin/bookings', version: '1' })
export class V1BookingsAdminController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly accessService: AccessService,
    ) {}

    @ApiBody({ schema: AssignVehiclePayload })
    @ApiResource(BookingResponse)
    @Patch(':id/assign-vehicle')
    async assignVehicle(
        @Param('id') id: string,
        @Body() body: Static<typeof AssignVehiclePayload>,
        @Req() req: Request,
    ) {
        if (
            !this.accessService.hasAbility(
                req.user,
                Actions.update,
                new BookingSubject(),
            )
        ) {
            throw new ForbiddenException('Not allowed to manage bookings');
        }
        return this.commandBus.execute(
            new AssignVehicleToBookingCommand(
                id,
                body.vehicleId,
                body.batteryId,
            ),
        );
    }
}
