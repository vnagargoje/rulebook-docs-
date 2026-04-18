import { CreateBatteryPayload } from './create-battery.command'

export type UpdateBatteryPayload = Partial<CreateBatteryPayload>

export class UpdateBatteryCommand {
    constructor(
        public readonly batteryId: string,
        public readonly payload: UpdateBatteryPayload,
    ) {}
}
