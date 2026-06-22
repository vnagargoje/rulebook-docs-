import { Type } from '@sinclair/typebox';
import { VehicleMaintenanceStatus } from '@yugo/shared';

export const CreateVehicleMaintenancePayload = Type.Object({
    vehicleId: Type.String(),
    issueDescription: Type.String(),
    status: Type.Optional(Type.Enum(VehicleMaintenanceStatus, { default: VehicleMaintenanceStatus.OPEN })),
    expectedFixDate: Type.Optional(Type.String({ format: 'date' })),
    remarks: Type.Optional(Type.String()),
});

export const UpdateVehicleMaintenancePayload = Type.Partial(
    CreateVehicleMaintenancePayload,
);
