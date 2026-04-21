import { Module } from '@nestjs/common';
import { V1VehicleSurrenderController } from './controllers/v1/surrenders.controller';
import {
    GetVehicleSurrenderDetailsHandler,
    SurrenderVehicleHandler,
} from '@yugo/cqrs';

@Module({
    controllers: [V1VehicleSurrenderController],
    providers: [GetVehicleSurrenderDetailsHandler, SurrenderVehicleHandler],
})
export class SurrendersModule {}
