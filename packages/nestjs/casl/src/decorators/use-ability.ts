import { SetMetadata } from '@nestjs/common'
import { CASL_ABILITY_METADATA } from '../constants'

export function UseAbility<A extends string = string, S extends string = string, SH extends string = string>(
    action: A,
    subject: S,
    subjectHook: SH | boolean = true,
) {
    return SetMetadata(CASL_ABILITY_METADATA, { action, subject, subjectHook })
}
