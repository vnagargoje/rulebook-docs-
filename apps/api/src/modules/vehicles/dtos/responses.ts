import { Type } from '@sinclair/typebox';
import { VehicleStatus } from '@yugo/shared';

export const VehiclePropertiesResponse = Type.Object({
    brand: Type.Optional(Type.String()),
    model: Type.Optional(Type.String()),
    insuranceExpiry: Type.Optional(Type.String()),
});

export const VehicleResponse = Type.Object({
    id: Type.String(),
    type: Type.Optional(Type.String()),
    vehicleNumber: Type.Optional(Type.String()),
    rcNumber: Type.Optional(Type.String()),
    chassisNumber: Type.Optional(Type.String()),
    gpsId: Type.Optional(Type.String()),
    properties: Type.Optional(VehiclePropertiesResponse),
    stationId: Type.Optional(Type.String()),
    station: Type.Optional(
        Type.Object({
            id: Type.String(),
            name: Type.Optional(Type.String()),
            type: Type.Optional(Type.String()),
        }),
    ),
    status: Type.Enum(VehicleStatus),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
});
