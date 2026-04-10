import { Logger } from '@nestjs/common'

/**
 * A simple decorator to log class instantiation.
 */
export function Log() {
    return function (target: any) {
        const logger = new Logger(target.name)
        logger.log('Class initialized')
    }
}
