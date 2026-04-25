import { Type } from '@sinclair/typebox';

export const VehicleSurrenderListResponse = Type.Object({
    id: Type.String(),
    bookingId: Type.String(),
    vehicleId: Type.String(),
    penalty: Type.Number(),
    miscCharges: Type.Number(),
    refundAmount: Type.Number(),
    notes: Type.Union([Type.String(), Type.Null()]),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    vehicle: Type.Optional(
        Type.Union([
            Type.Object({
                id: Type.String(),
                vehicleNumber: Type.String(),
            }),
            Type.Null(),
        ]),
    ),
    booking: Type.Optional(
        Type.Union([
            Type.Object({
                id: Type.String(),
                userPlanId: Type.String(),
                userId: Type.String(),
                status: Type.String(),
            }),
            Type.Null(),
        ]),
    ),
});

export const VehicleSurrenderDetailsResponse = Type.Object({
    customerId: Type.String(),
    customerName: Type.Union([Type.String(), Type.Null()]),
    depositAmount: Type.Number(),
    rtoPenalty: Type.Number(),
    refundAmount: Type.Number(),
});

export const SurrenderVehicleResponse = Type.Object({
    id: Type.String(),
    bookingId: Type.String(),
    userPlanId: Type.String(),
    vehicleId: Type.String(),
    vehicle: Type.Object({
        id: Type.String(),
        vehicleNumber: Type.String(),
    }),
    penalty: Type.Number(),
    miscCharges: Type.Number(),
    refundAmount: Type.Number(),
    notes: Type.Union([Type.String(), Type.Null()]),
});
