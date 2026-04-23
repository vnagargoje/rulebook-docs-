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

export type SendOtpResponse = {
    mobilenumber: string
    method: 'sms'
    otpSent: boolean
}

export type SendOtpPayload = {
    mobilenumber: string
}

export type VerifyOtpResponse = {
    verified?: boolean
    accessToken?: string
    refreshToken?: string
}

export type VerifiedOtpResponse = {
    verified: true
    accessToken: string
    refreshToken: string
}

export type VerifyOtpPayload = {
    mobilenumber: string
    otp: string
}

export type VerifyOtpVariables = {
    phoneNumber: string
    otp: string
}

export type RefreshTokenResponse = {
    accessToken: string
    refreshToken?: string
}
