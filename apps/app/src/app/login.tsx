import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { demoAuthToken } from '@/auth/login.data'
import { LoginForm } from '@/auth/login-form'
import type { LoginFormValues } from '@/auth/login.types'
import { FocusAwareStatusBar } from '@/components/ui'
import { useAuthStore } from '@/auth/use-auth-store'

export default function LoginScreen() {
    const router = useRouter()
    const signIn = useAuthStore.use.signIn()

    const handleSubmit = useCallback(
        (_data: LoginFormValues) => {
            signIn(demoAuthToken)
            router.push('/')
        },
        [router, signIn],
    )

    return (
        <>
            <FocusAwareStatusBar />
            <LoginForm onSubmit={handleSubmit} />
        </>
    )
}
