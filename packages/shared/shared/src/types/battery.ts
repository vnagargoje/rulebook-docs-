export interface BatteryProperties {
    mfgDate?: string | Date
    capacity?: string
    range?: string
    lifecycle?: string
    chargingTime?: string
    weight?: string
    warranty?: string
    removableOption?: boolean
    [key: string]: any
}
