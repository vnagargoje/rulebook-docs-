import { Module } from '@nestjs/common';
import {
    DispatchBatteriesHandler,
    ReceiveBatteriesHandler,
    UpdateBatteryStatusHandler,
} from '@yugo/cqrs';
import { V1BatteryTransportsController } from './controllers/v1/battery-transports.controller';

const CommandHandlers = [
    DispatchBatteriesHandler,
    ReceiveBatteriesHandler,
    UpdateBatteryStatusHandler,
];

@Module({
    controllers: [V1BatteryTransportsController],
    providers: [...CommandHandlers],
})
export class BatteryTransportsModule {}
