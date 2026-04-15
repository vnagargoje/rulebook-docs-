import type { CaslRequest } from './request'

export type AnyObject = Record<PropertyKey, unknown>

export interface SubjectBeforeFilterHook<S = AnyObject> {
    run: (request: CaslRequest) => Promise<S | undefined>
}
