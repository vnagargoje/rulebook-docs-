import { Type } from '@sinclair/typebox';

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
