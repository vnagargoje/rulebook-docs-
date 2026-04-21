import { Module } from '@nestjs/common';
import { V1VehiclesController } from './controllers/v1/vehicles.controller';
import { CreateVehicleHandler, UpdateVehicleHandler } from '@yugo/cqrs';

const CommandHandlers = [CreateVehicleHandler, UpdateVehicleHandler];

@Module({
    controllers: [V1VehiclesController],
    providers: [...CommandHandlers],
})
export class VehiclesModule {}
