import { Gender } from '@yugo/shared'

export interface CreateUserAddressPayload {
    lineOne: string
    lineTwo?: string
    pincode: string
    cityId?: string
}

export interface CreateUserPayload {
    email?: string
    mobilenumber: string
    firstName?: string
    lastName?: string
    gender?: Gender
    role?: string
    properties?: unknown
    dateOfBirth?: string
    address?: CreateUserAddressPayload
    stationId?: string
    active?: boolean
}

export class CreateUserCommand {
    constructor(public readonly payload: CreateUserPayload) {}
}
