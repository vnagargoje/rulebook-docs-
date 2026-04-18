import type { AuthToken, VerifiedOtpResponse, VerifyOtpResponse } from '@/types/auth/auth.types'

export const DEFAULT_AUTH_REDIRECT = '/customer/profile'

function toStringValue(value: unknown) {
    return typeof value === 'string' ? value : ''
}

export function normalizeMobileNumber(value: unknown) {
    return toStringValue(value).trim().replace(/\s+/g, '')
}

export function normalizeOtpCode(value: unknown) {
    return toStringValue(value).replace(/\D+/g, '').trim()
}

export function getOtpScreenParams(params: {
    mobilenumber: string
    redirect: string
}) {
    return {
        pathname: '/otp' as const,
        params: {
            phone: normalizeMobileNumber(params.mobilenumber),
            redirect: sanitizeInternalRedirect(params.redirect),
        },
    }
}

export function sanitizeInternalRedirect(value: unknown) {
    const redirect = toStringValue(value).trim()

    if (!redirect.startsWith('/') || redirect.startsWith('//')) {
        return DEFAULT_AUTH_REDIRECT
    }

    return redirect
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
