import { Type } from '@sinclair/typebox';

export const UserPlanResponse = Type.Object({
    id: Type.String(),
    userId: Type.String(),
    planId: Type.String(),
    planSnapshot: Type.Any(),
    status: Type.String(),
    startsAt: Type.Union([Type.String(), Type.Null()]),
    expiresAt: Type.Union([Type.String(), Type.Null()]),
    remainingKm: Type.Number(),
    qrCodeId: Type.Union([Type.String(), Type.Null()]),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});

export const UserPlanQrScanResponse = Type.Object({
    userPlan: Type.Object({
        id: Type.String(),
        status: Type.String(),
        planSnapshot: Type.Any(),
        remainingKm: Type.Number(),
        startsAt: Type.Union([Type.String(), Type.Null()]),
        expiresAt: Type.Union([Type.String(), Type.Null()]),
        qrCodeUrl: Type.Union([Type.String(), Type.Null()]),
    }),
    user: Type.Union([
        Type.Object({
            id: Type.String(),
            firstName: Type.Union([Type.String(), Type.Null()]),
            lastName: Type.Union([Type.String(), Type.Null()]),
            mobilenumber: Type.Union([Type.String(), Type.Null()]),
            email: Type.Union([Type.String(), Type.Null()]),
        }),
        Type.Null(),
    ]),
    plan: Type.Union([
        Type.Object({
            id: Type.String(),
            name: Type.String(),
        }),
        Type.Null(),
    ]),
    booking: Type.Union([
        Type.Object({
            id: Type.String(),
            status: Type.String(),
            stationId: Type.String(),
            vehicleId: Type.Union([Type.String(), Type.Null()]),
            batteryId: Type.Union([Type.String(), Type.Null()]),
            pickupOtp: Type.String(),
            startedAt: Type.Union([Type.String(), Type.Null()]),
            completedAt: Type.Union([Type.String(), Type.Null()]),
        }),
        Type.Null(),
    ]),
});
