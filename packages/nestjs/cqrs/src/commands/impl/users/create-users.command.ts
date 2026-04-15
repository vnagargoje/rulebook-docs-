import { Gender } from '@yugo/shared'

export interface CreateUserPayload {
    email?: string
    mobilenumber: string
    firstName?: string
    lastName?: string
    gender?: Gender
    role?: string
    properties?: unknown
    dateOfBirth?: string
}

export class CreateUserCommand {
    constructor(public readonly payload: CreateUserPayload) {}
}
