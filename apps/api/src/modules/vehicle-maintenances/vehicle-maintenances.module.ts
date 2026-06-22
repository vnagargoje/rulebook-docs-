import { Module } from '@nestjs/common';
import {
    CreateVehicleMaintenanceHandler,
    UpdateVehicleMaintenanceHandler,
} from '@yugo/cqrs';
import { V1VehicleMaintenancesController } from './controllers/v1/vehicle-maintenances.controller';

const Handlers = [
    CreateVehicleMaintenanceHandler,
    UpdateVehicleMaintenanceHandler,
];

@Module({
    controllers: [V1VehicleMaintenancesController],
    providers: [...Handlers],
})
export class VehicleMaintenancesModule {}
