export interface CreateTopUpPayload {
    name: string
    description?: string
    kmLimit: number
    price: number
    active?: boolean
    gstPercentage?: number
}

export class CreateTopUpCommand {
    constructor(public readonly payload: CreateTopUpPayload) {}
}
