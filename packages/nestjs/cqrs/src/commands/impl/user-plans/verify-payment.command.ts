export class VerifyPaymentCommand {
    constructor(
        public readonly userId: string,
        public readonly razorpayOrderId: string,
        public readonly razorpayPaymentId: string,
        public readonly razorpaySignature: string,
    ) {}
}
