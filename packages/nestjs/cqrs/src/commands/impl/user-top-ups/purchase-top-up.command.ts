export class PurchaseTopUpCommand {
    constructor(
        public readonly userId: string,
        public readonly topUpId: string,
        public readonly userPlanId: string,
    ) {}
}
