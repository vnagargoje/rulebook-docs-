import { Type } from '@sinclair/typebox';

export const TopUpResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    validityDays: Type.Number(),
    kmLimit: Type.Number(),
    price: Type.Number(),
    gst: Type.Number(),
    active: Type.Boolean(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});
