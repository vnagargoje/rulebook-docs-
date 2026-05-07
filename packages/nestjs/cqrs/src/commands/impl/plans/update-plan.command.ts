export interface UpdatePlanPayload {
    name?: string
    description?: string
    validityDays?: number
    kmLimit?: number
    price?: number
    deposit?: number
    gstPercentage: number
    active?: boolean
}

export class UpdatePlanCommand {
    constructor(
        public readonly planId: string,
        public readonly payload: UpdatePlanPayload,
    ) {}
}
