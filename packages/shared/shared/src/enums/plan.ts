export enum UserPlanStatus {
    PURCHASED = 'purchased',
    FAILED = 'failed',
    PENDING = 'pending',
    ACTIVE = 'active',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
}

export enum UserTopUpStatus {
    AWAITING = 'awaiting',
    APPLIED = 'applied',
    FAILED = 'failed',
}

export enum PaymentStatus {
    AWAITING = 'awaiting',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
}
