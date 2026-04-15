import { Module } from '@nestjs/common';
import { CreateUserHandler, UpdateUserHandler } from '@yugo/cqrs';
import { V1UsersController } from './controllers/v1/users.controller';

const Handlers = [CreateUserHandler, UpdateUserHandler];

@Module({
    controllers: [V1UsersController],
    providers: [...Handlers],
})
export class UsersModule {}
