import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AccessService } from './access.service'
import { CASL_ABILITY_METADATA } from './constants'
import { getRequestFromContext } from './utils'

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly accessService: AccessService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const abilityMeta = this.reflector.get<{ action: string; subject: string; subjectHook?: string } | undefined>(
            CASL_ABILITY_METADATA,
            context.getHandler(),
        )
        const request = getRequestFromContext(context)
        if (!request.casl) {
            request.casl = {}
        }
        return this.accessService.canActivateAbility(request, abilityMeta)
    }
}
