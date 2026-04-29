import { Module } from '@nestjs/common';
import { CreateUserHandler, UpdateUserHandler, UpdateUserAddressesHandler } from '@yugo/cqrs';
import { V1UsersController } from './controllers/v1/users.controller';

const Handlers = [CreateUserHandler, UpdateUserHandler, UpdateUserAddressesHandler];

@Module({
    controllers: [V1UsersController],
    providers: [...Handlers],
})
export class UsersModule {}
