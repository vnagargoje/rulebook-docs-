import { ContextType, ExecutionContext, NotAcceptableException } from '@nestjs/common'
import { CaslRequest } from './interfaces'

export function getRequestFromContext<R extends CaslRequest = CaslRequest>(context: ExecutionContext): R {
    switch (context.getType<ContextType>()) {
        case 'http':
        case 'ws':
            return context.switchToHttp().getRequest()
        default:
            throw new NotAcceptableException()
    }
}

export const getHookToken = (hook: string) => {
    return `__casl_hook_${hook}`
}
