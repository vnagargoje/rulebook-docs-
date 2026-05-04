export class VerifyTopUpPaymentCommand {
    constructor(
        public readonly userId: string,
        public readonly razorpayOrderId: string,
        public readonly razorpayPaymentId: string,
        public readonly razorpaySignature: string,
        public readonly topUpId: string,
        public readonly userPlanId: string,
    ) {}
}
