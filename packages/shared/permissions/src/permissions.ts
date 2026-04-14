import { Roles } from '@yugo/shared'
import { Actions } from './actions.enum'
import { Subjects } from './constants'
import { Permissions } from './interfaces/permissions'

export const permissions: Permissions<Roles[keyof Roles], Subjects, Actions> = {
    hub_manager() {},
    swap_manager() {},
    customer() {},
    system_user() {},
    system_admin({ can, extend }) {
        extend(Roles.HUB_MANAGER)
        extend(Roles.SWAP_MANAGER)
        extend(Roles.CUSTOMER)
        can(Actions.manage, Subjects.User)
    },
}
