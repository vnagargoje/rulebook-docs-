export interface UpdateTopUpPayload {
    name?: string
    description?: string
    validityDays?: number
    kmLimit?: number
    price?: number
    active?: boolean
}

export class UpdateTopUpCommand {
    constructor(
        public readonly topUpId: string,
        public readonly payload: UpdateTopUpPayload,
    ) {}
}
