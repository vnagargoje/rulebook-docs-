import { useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { loginContent } from '@/components/auth/auth.content'
import { AuthScreenShell } from '@/components/auth/auth-screen-shell'
import { LoginForm } from '@/components/auth/login-form'
import {
    DEFAULT_AUTH_REDIRECT,
    getOtpScreenParams,
    normalizeMobileNumber,
    sanitizeInternalRedirect,
} from '@/components/auth/auth.utils'
import type { LoginFormValues } from '@/types/auth/login.types'
import { useSendOtp } from '@/queries/auth.query'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useLocalSearchParams<{ redirect?: string }>()
    const redirect = sanitizeInternalRedirect(searchParams.redirect ?? DEFAULT_AUTH_REDIRECT)
    const sendOtp = useSendOtp()

    const handleSubmit = useCallback(
        async (data: LoginFormValues) => {
            const mobilenumber = normalizeMobileNumber(data.phoneNumber)

            const response = await sendOtp.mutateAsync(mobilenumber)
            router.push(
                getOtpScreenParams({
                    mobilenumber: response.data.mobilenumber ?? mobilenumber,
                    redirect,
                }),
            )
        },
        [redirect, router, sendOtp],
    )

    return (
        <AuthScreenShell
            eyebrow={loginContent.eyebrow}
            title={loginContent.title}
            description={loginContent.heroDescription}>
            <LoginForm
                isPending={sendOtp.isPending}
                onSubmit={handleSubmit}
            />
        </AuthScreenShell>
    )
}
