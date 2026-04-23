import { Module } from '@nestjs/common';
import {
    ApplyTopUpHandler,
    PurchasePlanHandler,
    GetUserPlanByQrHandler,
    VerifyPaymentHandler,
} from '@yugo/cqrs';
import { V1UserPlansController } from './controllers/v1/user-plans.controller';
import { V1WebhooksController } from './controllers/v1/webhooks.controller';

const Handlers = [
    PurchasePlanHandler,
    ApplyTopUpHandler,
    GetUserPlanByQrHandler,
    VerifyPaymentHandler,
];

@Module({
    controllers: [V1UserPlansController, V1WebhooksController],
    providers: [...Handlers],
})
export class UserPlansModule {}
