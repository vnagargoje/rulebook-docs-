import { Type } from '@sinclair/typebox';

export const BookingResponse = Type.Object({
    id: Type.String(),
    userPlanId: Type.String(),
    userPlan: Type.Object({
        id: Type.String(),
        userId: Type.String(),
        planId: Type.String(),
        status: Type.String(),
        planSnapshot: Type.Any(),
        startsAt: Type.Union([Type.String(), Type.Null()]),
        expiresAt: Type.Union([Type.String(), Type.Null()]),
        remainingKm: Type.Number(),
        totalKm: Type.Number(),
        qrCodeId: Type.Union([Type.String(), Type.Null()]),
        createdAt: Type.String(),
        updatedAt: Type.String(),
        user: Type.Optional(
            Type.Object({
                id: Type.String(),
                firstName: Type.Optional(Type.String()),
                lastName: Type.Optional(Type.String()),
                email: Type.Optional(Type.String()),
                mobilenumber: Type.Optional(Type.String()),
            }),
        ),
        plan: Type.Optional(
            Type.Object({
                id: Type.String(),
                name: Type.String(),
                description: Type.Optional(Type.String()),
                validityDays: Type.Number(),
                kmLimit: Type.Number(),
                price: Type.Number(),
                deposit: Type.Number(),
                gst: Type.Optional(Type.Number()),
                registrationFee: Type.Optional(Type.Number()),
                totalAmount: Type.Number(),
            }),
        ),
        qrCode: Type.Optional(
            Type.Object({
                id: Type.String(),
                filename: Type.Optional(Type.String()),
                path: Type.String(),
                mimeType: Type.Optional(Type.String()),
            }),
        ),
        topUps: Type.Optional(
            Type.Array(
                Type.Object({
                    id: Type.String(),
                    topUpId: Type.String(),
                    topUpSnapshot: Type.Any(),
                    status: Type.String(),
                    appliedAt: Type.Union([Type.String(), Type.Null()]),
                }),
            ),
        ),
    }),
    stationId: Type.Optional(Type.String()),
    station: Type.Optional(
        Type.Object({
            id: Type.String(),
            name: Type.String(),
            type: Type.String(),
            latitude: Type.Optional(Type.Number()),
            longitude: Type.Optional(Type.Number()),
            active: Type.Boolean(),
        }),
    ),
    vehicleId: Type.Optional(Type.String()),
    vehicle: Type.Optional(
        Type.Object({
            id: Type.String(),
            vehicleNumber: Type.Optional(Type.String()),
            rcNumber: Type.Optional(Type.String()),
            chassisNumber: Type.Optional(Type.String()),
        }),
    ),
    batteryId: Type.Optional(Type.String()),
    battery: Type.Optional(
        Type.Object({
            id: Type.String(),
            batteryQrId: Type.String(),
        }),
    ),
    status: Type.String(),
    pickupOtp: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});
