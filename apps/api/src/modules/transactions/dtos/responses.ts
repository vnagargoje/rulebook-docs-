import { Type } from '@sinclair/typebox';

export const TransactionResponse = Type.Object({
    id: Type.String(),
    razorpayOrderId: Type.String(),
    razorpayPaymentId: Type.Union([Type.String(), Type.Null()]),
    amount: Type.Number(),
    currency: Type.String(),
    status: Type.String(),
    notes: Type.Union([Type.String(), Type.Null()]),
    userPlanId: Type.String(),
    userPlan: Type.Optional(
        Type.Object({
            id: Type.String(),
            userId: Type.String(),
            planId: Type.String(),
            planSnapshot: Type.Any(),
            status: Type.String(),
            startsAt: Type.Union([Type.String(), Type.Null()]),
            expiresAt: Type.Union([Type.String(), Type.Null()]),
            remainingKm: Type.Number(),
            user: Type.Optional(
                Type.Object({
                    id: Type.String(),
                    firstName: Type.Union([Type.String(), Type.Null()]),
                    lastName: Type.Union([Type.String(), Type.Null()]),
                    email: Type.Union([Type.String(), Type.Null()]),
                    mobilenumber: Type.Union([Type.String(), Type.Null()]),
                }),
            ),
        }),
    ),
    userTopUpId: Type.Union([Type.String(), Type.Null()]),
    userTopUp: Type.Optional(
        Type.Object({
            id: Type.String(),
            topUpId: Type.String(),
            topUpSnapshot: Type.Any(),
            appliedAt: Type.Union([Type.String(), Type.Null()]),
        }),
    ),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});
