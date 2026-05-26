export interface PlanSnapshotProperties {
    name?: string
    description?: string
    validityDays?: number
    kmLimit?: number
    price?: number
    deposit?: number
    gstPercentage?: number
    gstAmount?: number
    registrationFee?: number
    totalAmount?: number
    [key: string]: any
}
