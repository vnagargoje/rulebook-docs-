import { Roles } from '@yugo/shared'
import { Actions } from './actions.enum'
import { Subjects } from './constants'
import { Permissions } from './interfaces/permissions'

export const permissions: Permissions<Roles[keyof Roles], Subjects, Actions> = {
    customer({ can }) {
        can(Actions.read, Subjects.Plan)
        can(Actions.read, Subjects.TopUp)
        can(Actions.create, Subjects.UserPlan)
        can(Actions.read, Subjects.UserPlan)
        can(Actions.create, Subjects.Booking)
        can(Actions.read, Subjects.Booking)
        can(Actions.read, Subjects.Kyc)
        can(Actions.create, Subjects.Kyc)
    },
    hub_manager({ can }) {
        can(Actions.create, Subjects.BatteryTransport)
        can(Actions.read, Subjects.BatteryTransport)
    },
    swap_manager({ can }) {
        can(Actions.read, Subjects.Booking)
        can(Actions.update, Subjects.Booking)
        can(Actions.create, Subjects.BatterySwap)
        can(Actions.read, Subjects.BatterySwap)
        can(Actions.create, Subjects.BatteryTransport)
        can(Actions.read, Subjects.BatteryTransport)
    },
    system_user() {},
    system_admin({ can, extend }) {
        extend(Roles.HUB_MANAGER)
        extend(Roles.SWAP_MANAGER)
        extend(Roles.CUSTOMER)
        can(Actions.manage, Subjects.User)
        can(Actions.manage, Subjects.Plan)
        can(Actions.manage, Subjects.TopUp)
        can(Actions.manage, Subjects.UserPlan)
        can(Actions.manage, Subjects.Booking)
        can(Actions.manage, Subjects.Station)
        can(Actions.manage, Subjects.Vehicle)
        can(Actions.manage, Subjects.Battery)
        can(Actions.manage, Subjects.BatteryTransport)
        can(Actions.manage, Subjects.BatterySwap)
        can(Actions.manage, Subjects.VehicleSurrender)
        can(Actions.manage, Subjects.Kyc)
        can(Actions.manage, Subjects.Notification)
        can(Actions.manage, Subjects.VehicleMaintenance)
    },
}
