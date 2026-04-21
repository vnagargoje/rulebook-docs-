import { Module } from '@nestjs/common';
import {
    ApplyTopUpHandler,
    PurchasePlanHandler,
    GetUserPlanByQrHandler,
} from '@yugo/cqrs';
import { V1UserPlansController } from './controllers/v1/user-plans.controller';

const Handlers = [
    PurchasePlanHandler,
    ApplyTopUpHandler,
    GetUserPlanByQrHandler,
];

@Module({
    controllers: [V1UserPlansController],
    providers: [...Handlers],
})
export class UserPlansModule {}
