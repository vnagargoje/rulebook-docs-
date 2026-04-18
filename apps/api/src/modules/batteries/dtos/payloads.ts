import { Type } from '@sinclair/typebox';

export const BatteryPropertiesPayload = Type.Object({
    mfgDate: Type.Optional(Type.String()),
    capacity: Type.Optional(Type.String()),
    range: Type.Optional(Type.String()),
    lifecycle: Type.Optional(Type.String()),
    chargingTime: Type.Optional(Type.String()),
    weight: Type.Optional(Type.String()),
    warranty: Type.Optional(Type.String()),
    removableOption: Type.Optional(Type.Boolean()),
});

export const CreateBatteryPayload = Type.Object({
    batteryId: Type.String(),
    gpsId: Type.Optional(Type.String()),
    properties: Type.Optional(BatteryPropertiesPayload),
    stationId: Type.Optional(Type.String()),
});

export const UpdateBatteryPayload = Type.Partial(CreateBatteryPayload);
