import { Type } from '@sinclair/typebox';

export const AadhaarConnectPayload = Type.Object({});

export const AadhaarGenerateOtpPayload = Type.Object({
    sessionId: Type.String(),
    captcha: Type.String(),
    aadhaarNumber: Type.String(),
});

export const AadhaarVerifyOtpPayload = Type.Object({
    sessionId: Type.String(),
    otp: Type.String(),
    aadhaarNumber: Type.String(),
});

export const PanVerifyPayload = Type.Object({
    pan: Type.String(),
});

export const LicenseInitiatePayload = Type.Object({
    dlNumber: Type.String(),
    dateOfBirth: Type.String(),
});

export const LicenseGetResultPayload = Type.Object({});
