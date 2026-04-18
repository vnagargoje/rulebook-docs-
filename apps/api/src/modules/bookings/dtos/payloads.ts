import { Type } from '@sinclair/typebox';

export const AssignVehiclePayload = Type.Object({
    vehicleId: Type.String(),
    batteryId: Type.String(),
    otp: Type.String({ minLength: 4, maxLength: 4 }),
});
