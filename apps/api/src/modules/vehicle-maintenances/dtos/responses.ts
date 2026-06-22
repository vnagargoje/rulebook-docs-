import { Type } from '@sinclair/typebox';
import { VehicleMaintenanceStatus } from '@yugo/shared';
import { VehicleResponse } from '@/modules/vehicles/dtos/responses.js';

export const VehicleMaintenanceResponse = Type.Object({
    id: Type.String(),
    vehicleId: Type.String(),
    vehicle: Type.Optional(VehicleResponse),
    issueDescription: Type.String(),
    status: Type.Enum(VehicleMaintenanceStatus),
    expectedFixDate: Type.Optional(Type.String()),
    remarks: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
});
