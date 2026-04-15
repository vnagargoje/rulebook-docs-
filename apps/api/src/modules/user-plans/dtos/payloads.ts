import { Type } from '@sinclair/typebox';

export const PurchasePlanPayload = Type.Object({
    planId: Type.String(),
});

export const ApplyTopUpPayload = Type.Object({
    topUpId: Type.String(),
    userPlanId: Type.String(),
});
