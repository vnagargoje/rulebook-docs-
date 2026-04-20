import { type BatteryStatus } from '@yugo/shared'

export class UpdateBatteryStatusCommand {
    constructor(
        public readonly batteryId: string,
        public readonly status: BatteryStatus,
    ) {}
}
