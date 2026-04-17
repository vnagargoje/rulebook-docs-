import { Type } from '@sinclair/typebox';

export const PlanResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    validityDays: Type.Number(),
    kmLimit: Type.Number(),
    price: Type.Number(),
    deposit: Type.Number(),
    gst: Type.Number(),
    registrationFee: Type.Number(),
    totalAmount: Type.Number(),
    active: Type.Boolean(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});
