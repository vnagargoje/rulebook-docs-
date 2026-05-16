export interface UpdateTopUpPayload {
    name?: string
    description?: string
    kmLimit?: number
    price?: number
    active?: boolean
    gstPercentage?: number,
}

export class UpdateTopUpCommand {
    constructor(
        public readonly topUpId: string,
        public readonly payload: UpdateTopUpPayload,
    ) {}
}
