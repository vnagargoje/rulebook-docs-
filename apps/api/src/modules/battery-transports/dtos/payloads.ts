import { Type } from '@sinclair/typebox';
import { BatteryStatus } from '@yugo/shared';

export const DispatchBatteriesPayload = Type.Object({
    fromStationId: Type.String({ description: 'Source station ID' }),
    toStationId: Type.String({ description: 'Destination station ID' }),
    vehicleId: Type.String({ description: 'Vehicle carrying the batteries' }),
    batteryQrIds: Type.Array(Type.String(), {
        minItems: 1,
        description: 'List of battery QR IDs to dispatch',
    }),
});

export const ReceiveBatteriesPayload = Type.Object({
    batteryQrIds: Type.Array(Type.String(), {
        minItems: 1,
        description: 'List of battery QR IDs being received',
    }),
});

export const UpdateBatteryStatusPayload = Type.Object({
    status: Type.Enum(BatteryStatus, {
        description:
            'New battery status (only drained→charging and charging→charged allowed)',
    }),
});
