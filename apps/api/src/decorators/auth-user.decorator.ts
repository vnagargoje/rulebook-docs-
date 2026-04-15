import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthenticatedUser = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        return context.switchToHttp().getRequest().user;
    },
);
