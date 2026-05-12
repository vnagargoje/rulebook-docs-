import { Type } from '@sinclair/typebox';

export const KycDocumentResponse = Type.Object({
    id: Type.String(),
    documentId: Type.String(),
    type: Type.String(),
    status: Type.String(),
    verifiedAt: Type.Union([Type.String(), Type.Null()]),
    notes: Type.Union([Type.String(), Type.Null()]),
});

export const KycStatusResponse = Type.Object({
    aadhaar: Type.Union([KycDocumentResponse, Type.Null()]),
    pan: Type.Union([KycDocumentResponse, Type.Null()]),
    license: Type.Union([KycDocumentResponse, Type.Null()]),
});

export const AadhaarConnectResponse = Type.Object({
    sessionId: Type.String(),
    captcha: Type.String(),
});

export const AadhaarReloadCaptchaResponse = Type.Object({
    captcha: Type.String(),
});

export const GenericKycResponse = Type.Object({
    success: Type.Boolean(),
    message: Type.String(),
});

export const LicenseInitiateResponse = Type.Object({
    requestId: Type.String(),
});

export const KycDetailsResponse = Type.Object({
    id: Type.String(),
    documentId: Type.String(),
    type: Type.String(),
    status: Type.String(),
    verifiedAt: Type.Union([Type.String(), Type.Null()]),
    notes: Type.Union([Type.String(), Type.Null()]),
    userId: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});

export const AllKycResponse = Type.Array(KycDetailsResponse);
