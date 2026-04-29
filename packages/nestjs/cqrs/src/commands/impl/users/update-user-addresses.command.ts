import { CreateUserAddressPayload } from './create-users.command.js'

export interface UpdateUserAddressesPayload {
    current?: CreateUserAddressPayload
    permanent?: CreateUserAddressPayload
}

export class UpdateUserAddressesCommand {
    constructor(
        public readonly userId: string,
        public readonly payload: UpdateUserAddressesPayload,
    ) {}
}
