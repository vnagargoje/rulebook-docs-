import { Module } from '@nestjs/common';
import { V1VehicleSurrenderController } from './controllers/v1/surrenders.controller';
import { GetVehicleSurrenderDetailsHandler } from '@yugo/cqrs';

@Module({
    controllers: [V1VehicleSurrenderController],
    providers: [GetVehicleSurrenderDetailsHandler],
})
export class SurrendersModule {}
