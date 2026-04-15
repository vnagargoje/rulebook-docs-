import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { demoAuthToken } from './login.data'
import { LoginForm } from './login-form'
import type { LoginFormValues } from './login.types'
import { FocusAwareStatusBar } from '@/components/ui'
import { useAuthStore } from '@/features/auth/use-auth-store'

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
