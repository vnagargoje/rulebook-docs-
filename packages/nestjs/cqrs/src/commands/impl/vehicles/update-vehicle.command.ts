import { CreateVehiclePayload } from './create-vehicle.command'

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>

export class UpdateVehicleCommand {
    constructor(
        public readonly vehicleId: string,
        public readonly payload: UpdateVehiclePayload,
    ) {}
}
