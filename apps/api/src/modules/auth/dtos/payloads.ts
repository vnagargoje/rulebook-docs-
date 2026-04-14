import { Type } from '@sinclair/typebox';

export const AuthSignInPayload = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String(),
});

export const OtpSendPayload = Type.Object({
    mobilenumber: Type.String(),
});

export const OtpVerifyPayload = Type.Object({
    mobilenumber: Type.String(),
    otp: Type.String(),
});
