import { Module } from '@nestjs/common';
import {
    AssignVehicleToBookingHandler,
    CreateBookingHandler,
} from '@yugo/cqrs';
import { V1BookingsController } from './controllers/v1/bookings.controller';
import { V1BookingsAdminController } from './controllers/v1/bookings-admin.controller';

const Handlers = [CreateBookingHandler, AssignVehicleToBookingHandler];

@Module({
    controllers: [V1BookingsController, V1BookingsAdminController],
    providers: [...Handlers],
})
export class BookingsModule {}
