import { Type } from '@sinclair/typebox';

export const PurchasePlanPayload = Type.Object({
    planId: Type.String(),
});

export const VerifyPaymentPayload = Type.Object({
    razorpayOrderId: Type.String(),
    razorpayPaymentId: Type.String(),
    razorpaySignature: Type.String(),
});

export const ApplyTopUpPayload = Type.Object({
    topUpId: Type.String(),
    userPlanId: Type.String(),
});
