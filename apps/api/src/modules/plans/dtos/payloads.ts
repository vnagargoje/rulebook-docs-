import { Type } from '@sinclair/typebox';

export const CreatePlanPayload = Type.Object({
    name: Type.String(),
    description: Type.Optional(Type.String()),
    validityDays: Type.Number(),
    kmLimit: Type.Number(),
    price: Type.Number(),
    deposit: Type.Number(),
    gst: Type.Number(),
    registrationFee: Type.Optional(Type.Number()),
    active: Type.Optional(Type.Boolean()),
});

export const UpdatePlanPayload = Type.Partial(CreatePlanPayload);
