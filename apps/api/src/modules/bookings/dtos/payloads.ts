import { Type } from '@sinclair/typebox';

export const CreateBookingPayload = Type.Object({
    userPlanId: Type.String(),
    stationId: Type.String(),
});

export const AssignVehiclePayload = Type.Object({
    vehicleId: Type.String(),
    batteryId: Type.String(),
});
