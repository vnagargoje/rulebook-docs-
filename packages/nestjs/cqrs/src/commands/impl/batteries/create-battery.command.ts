import { type BatteryProperties } from '@yugo/shared'

export interface CreateBatteryPayload {
    batteryQrId: string
    gpsId?: string
    properties?: BatteryProperties
    stationId?: string
    range?: number
}

export class CreateBatteryCommand {
    constructor(public readonly payload: CreateBatteryPayload) {}
}
