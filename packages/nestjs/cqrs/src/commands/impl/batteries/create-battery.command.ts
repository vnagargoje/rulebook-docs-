import { type BatteryProperties, type BatteryStatus } from '@yugo/shared'

export interface CreateBatteryPayload {
    batteryQrId: string
    gpsId?: string
    properties?: BatteryProperties
    stationId?: string
    range?: number
    status?: BatteryStatus
}

export class CreateBatteryCommand {
    constructor(public readonly payload: CreateBatteryPayload) {}
}
