import { Type } from '@sinclair/typebox';

export const SurrenderVehiclePayload = Type.Object({
    penalty: Type.Number({ minimum: 0, default: 0 }),
    miscCharges: Type.Number({ minimum: 0, default: 0 }),
    refundAmount: Type.Number({ minimum: 0, default: 0 }),
    notes: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});
