import { useCallback } from 'react'
import type { Href } from 'expo-router'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { otpContent } from '@/components/auth/auth.content'
import { AuthScreenShell } from '@/components/auth/auth-screen-shell'
import { OTPForm } from '@/components/auth/otp-form'
import {
    DEFAULT_AUTH_REDIRECT,
    isVerifiedOtpResponse,
    normalizeMobileNumber,
    normalizeOtpCode,
    sanitizeInternalRedirect,
} from '@/components/auth/auth.utils'
import { showErrorMessage } from '@/components/ui'
import type { OTPFormValues } from '@/types/auth/otp.types'
import { useVerifyOtp } from '@/queries/auth.query'

export default function OtpPage() {
    const router = useRouter()
    const searchParams = useLocalSearchParams<{ phone?: string, redirect?: string }>()
    const phone = normalizeMobileNumber(String(searchParams.phone ?? ''))
    const redirect = sanitizeInternalRedirect(searchParams.redirect ?? DEFAULT_AUTH_REDIRECT)
    const verifyOtp = useVerifyOtp()

    const handleSubmit = useCallback(
        async (data: OTPFormValues) => {
            if (!phone) {
                showErrorMessage('Phone number is missing. Please request a new OTP.')
                router.replace('/login' as Href)
                return
            }

            const response = await verifyOtp.mutateAsync({
                phoneNumber: phone,
                otp: normalizeOtpCode(data.code),
            })

            if (!isVerifiedOtpResponse(response)) {
                showErrorMessage('Invalid OTP. Please try again.')
                return
            }

            router.replace(redirect as Href)
        },
        [phone, redirect, router, verifyOtp],
    )

    return (
        <AuthScreenShell
            eyebrow={otpContent.eyebrow}
            title={otpContent.title}
            description={phone
                ? `Enter the code sent to ${phone} to continue securely.`
                : otpContent.heroFallbackDescription}>
            <OTPForm
                phone={phone}
                isPending={verifyOtp.isPending}
                onSubmit={handleSubmit}
            />
        </AuthScreenShell>
    )
}
