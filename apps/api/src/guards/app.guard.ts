import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class AppAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        try {
            const canActivateResult = super.canActivate(context);
            const result =
                canActivateResult instanceof Observable
                    ? await firstValueFrom(canActivateResult)
                    : await canActivateResult;

            return isPublic ? true : result;
        } catch (error) {
            if (isPublic) {
                return true;
            }
            throw error;
        }
    }
}
