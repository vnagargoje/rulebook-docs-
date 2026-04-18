import { type VehicleProperties } from '@yugo/shared'

export interface CreateVehiclePayload {
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
