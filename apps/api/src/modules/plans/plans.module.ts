import { Module } from '@nestjs/common';
import { CreatePlanHandler, UpdatePlanHandler } from '@yugo/cqrs';
import { V1PlansController } from './controllers/v1/plans.controller';
import { V1PlansAdminController } from './controllers/v1/plans-admin.controller';

const Handlers = [CreatePlanHandler, UpdatePlanHandler];

@Module({
    controllers: [V1PlansController, V1PlansAdminController],
    providers: [...Handlers],
})
export class PlansModule {}
