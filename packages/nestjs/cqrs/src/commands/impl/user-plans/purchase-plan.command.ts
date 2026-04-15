export class PurchasePlanCommand {
    constructor(
        public readonly userId: string,
        public readonly planId: string,
    ) {}
}
