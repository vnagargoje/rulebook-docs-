import { Subject } from '@casl/ability'
import { UserAbilityBuilder } from '../user-ability-builder'
import { CaslUser } from './user'

export type DefinePermissions<Subjects extends Subject, Actions extends string, U extends CaslUser> = (
    builder: UserAbilityBuilder<Subjects, Actions, U>,
) => void

export type Permissions<
    Roles extends string = string,
    Subjects extends Subject = Subject,
    Actions extends string = string,
    U extends CaslUser = CaslUser,
> = Partial<Record<Roles, DefinePermissions<Subjects, Actions, U>>>
