import { Module } from '@nestjs/common';
import {
    ApplyTopUpHandler,
    PurchasePlanHandler,
    PurchaseTopUpHandler,
    GetUserPlanByQrHandler,
    VerifyPaymentHandler,
    VerifyTopUpPaymentHandler,
} from '@yugo/cqrs';
import { V1UserPlansController } from './controllers/v1/user-plans.controller';
import { V1WebhooksController } from './controllers/v1/webhooks.controller';

const Handlers = [
    PurchasePlanHandler,
    ApplyTopUpHandler,
    PurchaseTopUpHandler,
    GetUserPlanByQrHandler,
    VerifyPaymentHandler,
    VerifyTopUpPaymentHandler,
];

@Module({
    controllers: [V1UserPlansController, V1WebhooksController],
    providers: [...Handlers],
})
export class UserPlansModule {}
