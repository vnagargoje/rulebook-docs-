import { type VehicleMaintenanceStatus } from '@yugo/shared'

export interface CreateVehicleMaintenancePayload {
    vehicleId: string
    issueDescription: string
    status?: VehicleMaintenanceStatus
    expectedFixDate?: string | Date
    remarks?: string
}

export class CreateVehicleMaintenanceCommand {
    constructor(public readonly payload: CreateVehicleMaintenancePayload) {}
}
