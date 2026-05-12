export class ApplyManualKycCommand {
    constructor(
        public readonly userId: string,
        public readonly id: string, // KYC record ID
        public readonly notes?: string,
    ) {}
}
