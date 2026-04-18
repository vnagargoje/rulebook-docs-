import { Type } from '@sinclair/typebox';

export const BatteryPropertiesResponse = Type.Object({
    mfgDate: Type.Optional(Type.String()),
    capacity: Type.Optional(Type.String()),
    range: Type.Optional(Type.String()),
    lifecycle: Type.Optional(Type.String()),
    chargingTime: Type.Optional(Type.String()),
    weight: Type.Optional(Type.String()),
    warranty: Type.Optional(Type.String()),
    removableOption: Type.Optional(Type.Boolean()),
});

export const BatteryResponse = Type.Object({
    id: Type.String(),
    batteryId: Type.String(),
    gpsId: Type.Optional(Type.String()),
    properties: Type.Optional(BatteryPropertiesResponse),
    stationId: Type.Optional(Type.String()),
    station: Type.Optional(
        Type.Object({
            id: Type.String(),
            name: Type.Optional(Type.String()),
            type: Type.Optional(Type.String()),
        }),
    ),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
});
