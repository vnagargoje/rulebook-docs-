import { Type } from '@sinclair/typebox';
import { BatteryStatus } from '@yugo/shared';

export const BatteryPropertiesResponse = Type.Object({
    mfgDate: Type.Optional(Type.String()),
    capacity: Type.Optional(Type.String()),
    range: Type.Optional(Type.String()),
    lifecycle: Type.Optional(Type.String()),
    chargingTime: Type.Optional(Type.String()),
    weight: Type.Optional(Type.String()),
    warranty: Type.Optional(Type.String()),
    removableOption: Type.Optional(Type.Boolean()),
    lat: Type.Optional(Type.Number()),
    long: Type.Optional(Type.Number()),
    socPercent: Type.Optional(Type.Number()),
    speed: Type.Optional(Type.Number()),
});

export const BatteryResponse = Type.Object({
    id: Type.String(),
    batteryQrId: Type.String(),
    status: Type.Enum(BatteryStatus),
    gpsId: Type.Optional(Type.String()),
    properties: Type.Optional(BatteryPropertiesResponse),
    stationId: Type.Optional(Type.String()),
    range: Type.Optional(Type.Integer()),
    station: Type.Optional(
        Type.Object({
            id: Type.String(),
            name: Type.Optional(Type.String()),
            type: Type.Optional(Type.String()),
        }),
    ),
    qrCode: Type.Optional(
        Type.Object({
            id: Type.String(),
            path: Type.String(),
        }),
    ),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
});
