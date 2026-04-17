import { Module } from '@nestjs/common';
import { V1StationsController } from './controllers/v1/stations.controller';
import { CreateStationHandler, UpdateStationHandler } from '@yugo/cqrs';

const CommandHandlers = [CreateStationHandler, UpdateStationHandler];

@Module({
    controllers: [V1StationsController],
    providers: [...CommandHandlers],
})
export class StationsModule {}
