import { Type } from '@sinclair/typebox';

export const InwardVerificationResponse = Type.Object({
    verified: Type.Boolean(),
    bookingId: Type.String(),
    batteryId: Type.String(),
    batteryQrId: Type.String(),
});

export const BatterySwapResponse = Type.Object({
    swapHistoryId: Type.String(),
    bookingId: Type.String(),
    vehicleId: Type.Optional(Type.String()),
    oldBatteryId: Type.String(),
    oldBatteryQrId: Type.String(),
    newBatteryId: Type.String(),
    newBatteryQrId: Type.String(),
    fromStationId: Type.Optional(Type.String()),
    toStationId: Type.Optional(Type.String()),
    swappedById: Type.String(),
    swappedAt: Type.Optional(Type.String()),
});

export const BatterySwapHistoryResponse = Type.Object({
    id: Type.String(),
    userPlanId: Type.String(),
    bookingId: Type.String(),
    vehicleId: Type.String(),
    oldBatteryId: Type.String(),
    oldBattery: Type.Optional(
        Type.Object({
            id: Type.String(),
            batteryQrId: Type.String(),
        }),
    ),
    newBatteryId: Type.String(),
    newBattery: Type.Optional(
        Type.Object({
            id: Type.String(),
            batteryQrId: Type.String(),
        }),
    ),
    fromStationId: Type.Optional(Type.String()),
    fromStation: Type.Optional(
        Type.Object({
            id: Type.String(),
            name: Type.String(),
            type: Type.String(),
        }),
    ),
    toStationId: Type.Optional(Type.String()),
    toStation: Type.Optional(
        Type.Object({
            id: Type.String(),
            name: Type.String(),
            type: Type.String(),
        }),
    ),
    swappedById: Type.String(),
    createdAt: Type.String(),
});
