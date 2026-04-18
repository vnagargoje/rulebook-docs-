import { Module } from '@nestjs/common';
import { V1BatteriesController } from './controllers/v1/batteries.controller';
import { CreateBatteryHandler, UpdateBatteryHandler } from '@yugo/cqrs';

const CommandHandlers = [CreateBatteryHandler, UpdateBatteryHandler];

@Module({
    controllers: [V1BatteriesController],
    providers: [...CommandHandlers],
})
export class BatteriesModule {}
