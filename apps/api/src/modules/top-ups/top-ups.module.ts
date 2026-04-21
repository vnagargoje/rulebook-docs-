import { Module } from '@nestjs/common';
import { CreateTopUpHandler, UpdateTopUpHandler } from '@yugo/cqrs';
import { V1TopUpsController } from './controllers/v1/top-ups.controller';
import { V1TopUpsAdminController } from './controllers/v1/top-ups-admin.controller';

const Handlers = [CreateTopUpHandler, UpdateTopUpHandler];

@Module({
    controllers: [V1TopUpsController, V1TopUpsAdminController],
    providers: [...Handlers],
})
export class TopUpsModule {}
