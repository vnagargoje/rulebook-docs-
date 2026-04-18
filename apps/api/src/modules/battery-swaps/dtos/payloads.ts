import { Type } from '@sinclair/typebox';

export const VerifyInwardBatteryPayload = Type.Object({
    bookingId: Type.String(),
    batteryQrId: Type.String({
        description: 'Physical battery ID from QR scan',
    }),
});

export const ExecuteSwapPayload = Type.Object({
    bookingId: Type.String(),
    newBatteryQrId: Type.String({
        description: 'Physical battery ID from QR scan',
    }),
    stationId: Type.String({
        description: 'Station where the swap is happening',
    }),
});
