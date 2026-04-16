export interface CreateTopUpPayload {
    name: string
    description?: string
    validityDays: number
    kmLimit: number
    price: number
    active?: boolean
}

export class CreateTopUpCommand {
    constructor(public readonly payload: CreateTopUpPayload) {}
}
