import { Type } from '@sinclair/typebox';

export const BookingResponse = Type.Object({
    id: Type.String(),
    userId: Type.String(),
    userPlanId: Type.String(),
    stationId: Type.String(),
    vehicleId: Type.Union([Type.String(), Type.Null()]),
    batteryId: Type.Union([Type.String(), Type.Null()]),
    status: Type.String(),
    pickupOtp: Type.String(),
    startedAt: Type.Union([Type.String(), Type.Null()]),
    completedAt: Type.Union([Type.String(), Type.Null()]),
    cancelledAt: Type.Union([Type.String(), Type.Null()]),
    cancellationReason: Type.Union([Type.String(), Type.Null()]),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});
