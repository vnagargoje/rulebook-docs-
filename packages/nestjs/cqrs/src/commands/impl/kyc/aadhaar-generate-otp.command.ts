export class AadhaarGenerateOtpCommand {
    constructor(
        public readonly userId: string,
        public readonly payload: {
            sessionId: string;
            captcha: string;
            aadhaarNumber: string;
        }
    ) {}
}
