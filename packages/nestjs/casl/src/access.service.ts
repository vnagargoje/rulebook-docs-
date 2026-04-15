import { Ability, PureAbility, Subject, subject } from '@casl/ability'
import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { DiscoveryService, Reflector } from '@nestjs/core'
import { MODULE_OPTIONS_TOKEN } from './base.module'
import { CASL_SUBJECT_HOOK_METADATA } from './constants'
import { CaslRequest, CaslUser, SubjectBeforeFilterHook } from './interfaces'
import type { CaslModuleOptions } from './interfaces/options'
import { UserAbilityBuilder } from './user-ability-builder'

export const nullConditionsMatcher = () => (): boolean => true

@Injectable()
export class AccessService implements OnModuleInit {
    hooks: Map<string, SubjectBeforeFilterHook> = new Map()
    constructor(
        @Inject(MODULE_OPTIONS_TOKEN) private readonly options: CaslModuleOptions,
        private readonly reflector: Reflector,
        private readonly discoveryService: DiscoveryService,
    ) {}
    async onModuleInit() {
        const providers = this.discoveryService.getProviders().filter((wrapper) => {
            const target = !wrapper.metatype || wrapper.inject ? wrapper.instance?.constructor : wrapper.metatype
            if (target) {
                return !!this.reflector.get(CASL_SUBJECT_HOOK_METADATA, target)
            }
            return false
        })
        providers.forEach((p) => {
            const { instance, metatype } = p
            const subject = this.reflector.get(CASL_SUBJECT_HOOK_METADATA, instance.constructor || metatype)
            this.hooks.set(subject, instance)
        })
    }

    getSubjectHook(key: string) {
        return this.hooks.get(key)
    }

    hasAbility(user: CaslUser, action: string, subject: Subject, field?: string) {
        if (!user) {
            return false
        }

        if (!action || !subject) {
            return false
        }

        const { superuserRole } = this.options
        const ability = this.createAbilityForUser(user)

        if (superuserRole && user.roles?.includes(superuserRole)) {
            return true
        }

        return ability.can(action, subject, field)
    }

    async canActivateAbility(
        request: CaslRequest,
        abilityMeta?: { action: string; subject: string; subjectHook?: string },
    ): Promise<boolean> {
        const { superuserRole } = this.options

        if (!request.user || !Array.isArray(request.user?.roles)) {
            return false
        }

        if (!abilityMeta || !abilityMeta?.action || !abilityMeta?.subject) {
            return false
        }

        if (superuserRole && request.user!.roles?.includes(superuserRole)) {
            return true
        }

        const ability = this.createAbilityForUser(request.user)
        const relevantRules = ability.rulesFor(abilityMeta.action, abilityMeta.subject)

        let subjectHook: SubjectBeforeFilterHook | undefined

        if (typeof abilityMeta.subjectHook === 'string') {
            subjectHook = this.getSubjectHook(abilityMeta.subjectHook)
        } else if (abilityMeta.subjectHook === true) {
            subjectHook = this.getSubjectHook(abilityMeta.subject)
        }

        if (!relevantRules.every((r) => r.conditions) || !subjectHook) {
            return ability.can(abilityMeta.action, abilityMeta.subject)
        }

        const subjectInstance = await subjectHook.run(request)

        if (!subjectInstance) {
            throw new BadRequestException('Subject hook returned nothing')
        }

        const finalSubject = (subjectInstance as any).modelName
            ? subjectInstance
            : subject(abilityMeta.subject, subjectInstance)

        request.casl.subject = finalSubject

        return ability.can(abilityMeta.action, finalSubject)
    }

    createAbilityForUser(user: CaslUser, AbilityClass = Ability) {
        const { permissions } = this.options
        const ability = new UserAbilityBuilder(user as CaslUser, permissions, AbilityClass)
        user.roles?.forEach((role) => {
            ability.permissionsFor(role)
        })
        if (AbilityClass === PureAbility) {
            return ability.build({ conditionsMatcher: nullConditionsMatcher })
        }
        return ability.build()
    }

    isSystemAdmin(user?: CaslUser): boolean {
        if (!user || !Array.isArray(user.roles)) {
            return false
        }
        return user.roles.includes('system_admin')
    }
}
