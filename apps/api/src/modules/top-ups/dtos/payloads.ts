import { Type } from '@sinclair/typebox';

export const CreateTopUpPayload = Type.Object({
    name: Type.String(),
    description: Type.Optional(Type.String()),
    validityDays: Type.Number(),
    kmLimit: Type.Number(),
    price: Type.Number(),
    gstPercentage: Type.Number(),
    active: Type.Optional(Type.Boolean()),
});

export const UpdateTopUpPayload = Type.Partial(CreateTopUpPayload);
