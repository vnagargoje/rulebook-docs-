import { StationType } from '@yugo/shared'

export interface AddressPayload {
    lineOne: string
    lineTwo?: string
    pincode: string
    cityId?: string
}

export interface CreateStationPayload {
    type: StationType
    name: string
    longitude?: number
    latitude?: number
    active?: boolean
    address?: AddressPayload
    managerId?: string
}

export class CreateStationCommand {
    constructor(public readonly payload: CreateStationPayload) {}
}
