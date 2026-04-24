import type {
    V1AuthSendOtpBody,
    V1AuthSendOtpResponse,
    V1AuthVerifyOtpBody,
    V1AuthVerifyOtpResponse,
} from '@/services/api/codegen/Api'

export type UserRole = 'customer' | 'swap_manager' | 'hub_manager'

export type JwtPayload = {
    id?: string
    email?: string
    mobileNumber?: string
    roles?: string[]
    exp?: number
    sub?: string
}

export type AuthenticationResult = {
    authenticated: boolean
    role?: UserRole
    userId?: string
}

export type AuthToken = {
    access: string
    refresh: string
    phoneNumber?: string
}

export type AuthStatus = 'idle' | 'signOut' | 'signIn'

export type AuthState = {
    token: AuthToken | null
    status: AuthStatus
    signIn: (token: AuthToken) => void
    signOut: () => void
    hydrate: () => void
}

export type SendOtpResponse = V1AuthSendOtpResponse

export type SendOtpPayload = V1AuthSendOtpBody

export type VerifyOtpResponse = V1AuthVerifyOtpResponse

export type VerifiedOtpResponse = VerifyOtpResponse & {
    verified: true
    accessToken: string
    refreshToken: string
}

export type VerifyOtpPayload = V1AuthVerifyOtpBody

export type VerifyOtpVariables = {
    phoneNumber: string
    otp: string
}

export type RefreshTokenResponse = {
    accessToken: string
    refreshToken?: string
}
