export interface CreatePlanPayload {
    name: string
    description?: string
    validityDays: number
    kmLimit: number
    price: number
    deposit: number
    gst: number
    registrationFee?: number
    active?: boolean
}

export class CreatePlanCommand {
    constructor(public readonly payload: CreatePlanPayload) {}
}
