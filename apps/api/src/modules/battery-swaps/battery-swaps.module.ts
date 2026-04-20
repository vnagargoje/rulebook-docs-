import { Module } from '@nestjs/common';
import {
    VerifyInwardBatteryHandler,
    ExecuteBatterySwapHandler,
} from '@yugo/cqrs';
import { V1BatterySwapsController } from './controllers/v1/battery-swaps.controller';

const CommandHandlers = [VerifyInwardBatteryHandler, ExecuteBatterySwapHandler];

@Module({
    controllers: [V1BatterySwapsController],
    providers: [...CommandHandlers],
})
export class BatterySwapsModule {}
