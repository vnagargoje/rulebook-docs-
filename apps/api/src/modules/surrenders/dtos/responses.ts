import { Type } from '@sinclair/typebox';

export const VehicleSurrenderDetailsResponse = Type.Object({
    customerId: Type.String(),
    customerName: Type.Union([Type.String(), Type.Null()]),
    depositAmount: Type.Number(),
    rtoPenalty: Type.Number(),
    refundAmount: Type.Number(),
});
