import type { ReactNode } from 'react'

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

export type AuthScreenShellProps = {
    eyebrow: string
    title: string
    description: string
    children: ReactNode
}

export type RefreshTokenResponse = {
    accessToken: string
    refreshToken?: string
}
