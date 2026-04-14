import { Type } from '@sinclair/typebox';

export const AuthSignInResponse = Type.Object({
    accessToken: Type.String(),
    refreshToken: Type.String(),
    user: Type.Object({
        id: Type.String(),
        email: Type.String(),
        roles: Type.Array(Type.String()),
    }),
});

export const OtpSendResponse = Type.Object({
    mobilenumber: Type.String(),
    method: Type.Literal('sms'),
    otpSent: Type.Boolean(),
});

export const OtpVerifyResponse = Type.Object({
    verified: Type.Boolean(),
    accessToken: Type.Optional(Type.String()),
    refreshToken: Type.Optional(Type.String()),
});
