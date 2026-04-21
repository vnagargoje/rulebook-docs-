import { Type } from '@sinclair/typebox';
import { VehicleType } from '@yugo/shared';

export const VehiclePropertiesPayload = Type.Object({
    brand: Type.Optional(Type.String()),
    model: Type.Optional(Type.String()),
    insuranceExpiry: Type.Optional(Type.String()),
});

export const CreateVehiclePayload = Type.Object({
    type: Type.Optional(Type.Enum(VehicleType)),
    vehicleNumber: Type.Optional(Type.String()),
    rcNumber: Type.Optional(Type.String()),
    chassisNumber: Type.Optional(Type.String()),
    gpsId: Type.Optional(Type.String()),
    properties: Type.Optional(VehiclePropertiesPayload),
    stationId: Type.Optional(Type.String()),
});

export const UpdateVehiclePayload = Type.Partial(CreateVehiclePayload);
