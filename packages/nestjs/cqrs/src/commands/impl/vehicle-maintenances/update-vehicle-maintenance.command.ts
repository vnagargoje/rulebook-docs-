import { type VehicleMaintenanceStatus } from '@yugo/shared'

export interface UpdateVehicleMaintenancePayload {
    vehicleId?: string
    issueDescription?: string
    status?: VehicleMaintenanceStatus
    expectedFixDate?: string | Date | null
    remarks?: string | null
}

export class UpdateVehicleMaintenanceCommand {
    constructor(
        public readonly id: string,
        public readonly payload: UpdateVehicleMaintenancePayload,
    ) {}
}
