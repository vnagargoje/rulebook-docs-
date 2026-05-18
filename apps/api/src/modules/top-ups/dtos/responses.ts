import { Type } from '@sinclair/typebox';

export const TopUpResponse = Type.Object({
    id: Type.String(),
    name: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    kmLimit: Type.Number(),
    price: Type.Number(),
    gstPercentage: Type.Number(),
    totalAmount: Type.Number(),
    active: Type.Boolean(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});
