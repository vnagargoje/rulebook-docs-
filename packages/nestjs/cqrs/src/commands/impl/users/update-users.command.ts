import { CreateUserPayload } from './create-users.command.js'

export type UpdateUserPayload = Partial<CreateUserPayload>

export class UpdateUserCommand {
    constructor(
        public readonly userId: string,
        public readonly payload: UpdateUserPayload,
        public readonly canUpdateRole = false,
    ) {}
}
