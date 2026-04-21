import { type VehicleProperties, type VehicleType } from '@yugo/shared'

export interface CreateVehiclePayload {
    type?: VehicleType
    vehicleNumber?: string
    rcNumber?: string
    chassisNumber?: string
    gpsId?: string
    properties?: VehicleProperties
    stationId?: string
}

export class CreateVehicleCommand {
    constructor(public readonly payload: CreateVehiclePayload) {}
}
