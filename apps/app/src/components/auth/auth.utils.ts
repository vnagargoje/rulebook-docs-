import type { AuthToken, VerifiedOtpResponse, VerifyOtpResponse } from '@/types/auth/auth.types'

function toStringValue(value: unknown) {
    return typeof value === 'string' ? value : ''
}

export function normalizeMobileNumber(value: unknown) {
    return toStringValue(value).trim().replace(/\s+/g, '')
}

export function isVerifiedOtpResponse(
    response: VerifyOtpResponse,
): response is VerifiedOtpResponse {
    return Boolean(
        response.verified
        && response.accessToken
        && response.refreshToken,
    )
}

export function createAuthToken(response: VerifiedOtpResponse, phoneNumber: string): AuthToken {
    return {
        access: response.accessToken,
        refresh: response.refreshToken,
        phoneNumber,
    }
}

export const DEFAULT_AUTH_REDIRECT = '/(tabs)'

export function normalizeOtpCode(code: unknown) {
    return typeof code === 'string' ? code.trim() : ''
}

export function sanitizeInternalRedirect(redirect: string) {
    return redirect.startsWith('/') ? redirect : `/${redirect}`
}
