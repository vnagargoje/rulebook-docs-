import { SubjectBeforeFilterHook } from './hooks'
import { Permissions } from './permissions'
export type AnyClass<ReturnType = any> = new (...args: any[]) => ReturnType

export type SubjectHooksMap = Record<string, AnyClass<SubjectBeforeFilterHook<unknown>>>

export interface CaslModuleOptions {
    isGlobal?: boolean
    superuserRole?: string
    permissions: Permissions
    subjectHooks?: SubjectHooksMap
}
