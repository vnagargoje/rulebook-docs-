import { Type } from '@sinclair/typebox';

export const BookingResponse = Type.Object({
    id: Type.String(),
    userPlanId: Type.String(),
    userPlan: Type.Object({
        id: Type.String(),
        status: Type.String(),
        planSnapshot: Type.Any(),
        startsAt: Type.Optional(Type.String()),
        expiresAt: Type.Optional(Type.String()),
        remainingKm: Type.Number(),
        plan: Type.Optional(
            Type.Object({
                id: Type.String(),
                name: Type.String(),
                validityDays: Type.Number(),
                kmLimit: Type.Number(),
                price: Type.Number(),
                deposit: Type.Number(),
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
            batteryId: Type.String(),
        }),
    ),
    status: Type.String(),
    pickupOtp: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});
