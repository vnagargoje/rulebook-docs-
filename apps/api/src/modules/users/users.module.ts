import { Module } from '@nestjs/common';
import { V1UsersController } from './controllers/v1/users.controller';

@Module({
    controllers: [V1UsersController],
})
export class UsersModule {}
