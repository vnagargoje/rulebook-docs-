import { type VehicleProperties, type VehicleType, type VehicleStatus } from '@yugo/shared'

export interface CreateVehiclePayload {
    type?: VehicleType
    vehicleNumber?: string
    rcNumber?: string
    chassisNumber?: string
    gpsId?: string
    properties?: VehicleProperties
    stationId?: string
    status?: VehicleStatus
}

export class CreateVehicleCommand {
    constructor(public readonly payload: CreateVehiclePayload) {}
}
