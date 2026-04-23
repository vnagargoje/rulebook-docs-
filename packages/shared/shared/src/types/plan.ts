export interface PlanSnapshotProperties {
    name?: string
    description?: string
    validityDays?: number
    kmLimit?: number
    price?: number
    deposit?: number
    gst?: number
    registrationFee?: number
    [key: string]: any
}
