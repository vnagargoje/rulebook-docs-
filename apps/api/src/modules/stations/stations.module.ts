import { Module } from '@nestjs/common';
import { V1StationsController } from './controllers/v1/stations.controller';
import { CreateStationHandler, GetNearestSwapStationsHandler, UpdateStationHandler } from '@yugo/cqrs';

const CommandHandlers = [CreateStationHandler, UpdateStationHandler];
const QueryHandlers = [GetNearestSwapStationsHandler];

@Module({
    controllers: [V1StationsController],
    providers: [...CommandHandlers, ...QueryHandlers],
})
export class StationsModule {}
