import { CASL_SUBJECT_HOOK_METADATA } from '../constants'

export const CaslSubjectHook = (subject: string): ClassDecorator => {
    return (target: object) => {
        Reflect.defineMetadata(CASL_SUBJECT_HOOK_METADATA, subject, target)
    }
}
