export class AadhaarVerifyOtpCommand {
    constructor(
        public readonly userId: string,
        public readonly payload: {
            sessionId: string;
            otp: string;
            aadhaarNumber: string;
        }
    ) {}
}
