import { Module } from '@nestjs/common';
import { V1TransactionsController } from './controllers/v1/transactions.controller';

@Module({
    controllers: [V1TransactionsController],
})
export class TransactionsModule {}
