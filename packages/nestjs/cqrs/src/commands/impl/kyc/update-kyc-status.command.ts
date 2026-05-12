import { KycStatus } from '@yugo/shared'

export class UpdateKycStatusCommand {
    constructor(
        public readonly id: string,
        public readonly status: KycStatus,
        public readonly notes?: string,
    ) {}
}
