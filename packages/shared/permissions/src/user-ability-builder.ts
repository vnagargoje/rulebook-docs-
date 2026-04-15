import { AbilityBuilder, AnyAbility, PureAbility, Subject } from '@casl/ability'
import { DefaultActions } from './actions.enum'
import { Permissions } from './interfaces/permissions'
import { CaslUser } from './interfaces/user'
import { AbilityTuple } from '@casl/ability'

export type AnyClass<ReturnType = any> = new (...args: any[]) => ReturnType

export class UserAbilityBuilder<
    Subjects extends Subject = Subject,
    Actions extends string = DefaultActions,
    U extends CaslUser = CaslUser,
> extends AbilityBuilder<AnyAbility> {
    constructor(
        public user: U,
        public permissions: Permissions<string, Subjects, Actions, U>,
        AbilityType: AnyClass<PureAbility<AbilityTuple<Actions, Subjects>>>,
    ) {
        super(AbilityType)
    }

    extend = (role: string): void => {
        this.permissionsFor(role)
    }

    permissionsFor(role: string): void {
        const rolePermissions = this.permissions[role]
        if (rolePermissions) {
            rolePermissions(this)
        }
    }
}
