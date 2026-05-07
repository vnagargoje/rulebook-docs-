export interface CreatePlanPayload {
    name: string
    description?: string
    validityDays: number
    kmLimit: number
    price: number
    deposit: number
    gstPercentage: number
    active?: boolean
}

export class CreatePlanCommand {
    constructor(public readonly payload: CreatePlanPayload) {}
}
