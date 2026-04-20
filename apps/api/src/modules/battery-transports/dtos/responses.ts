import { Type } from '@sinclair/typebox';
import { BatteryTransportStatus, BatteryStatus } from '@yugo/shared';

const StationSummary = Type.Object({
    id: Type.String(),
    name: Type.Optional(Type.String()),
    type: Type.Optional(Type.String()),
});

const VehicleSummary = Type.Object({
    id: Type.String(),
    vehicleNumber: Type.Optional(Type.String()),
});

export const BatteryTransportResponse = Type.Object({
    id: Type.String(),
    fromStationId: Type.String(),
    fromStation: Type.Optional(StationSummary),
    toStationId: Type.String(),
    toStation: Type.Optional(StationSummary),
    vehicleId: Type.String(),
    vehicle: Type.Optional(VehicleSummary),
    initiatedById: Type.String(),
    receivedById: Type.Optional(Type.String()),
    batteryIds: Type.Array(Type.String()),
    status: Type.Enum(BatteryTransportStatus),
    receivedAt: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
});

export const BatteryWithStatusResponse = Type.Object({
    id: Type.String(),
    batteryQrId: Type.String(),
    status: Type.Enum(BatteryStatus),
    stationId: Type.Optional(Type.String()),
    station: Type.Optional(StationSummary),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
});
