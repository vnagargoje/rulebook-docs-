import { createMutation, createQuery } from 'react-query-kit'

import { showError, showSuccessMessage } from '@/components/ui'
import { createAuthToken, isVerifiedOtpResponse } from '@/components/auth/auth.utils'
import { client } from '@/lib/api/client'
import { getToken, getUserId, getUserRole, isTokenExpired } from '@/lib/auth'
import { signIn, useAuthStore } from '@/stores/auth.store'
import type { AuthenticationResult, SendOtpResponse, VerifyOtpResponse, VerifyOtpVariables } from '@/types/auth/auth.types'

const handleMutationError = (error: unknown) => {
    showError(error)
}

export const useIsAuthenticated = createQuery<AuthenticationResult>({
    queryKey: ['isAuthenticated'],
    fetcher: async () => {
        const { token, user } = useAuthStore.getState()

        if (!token?.access || isTokenExpired(token.access)) {
            return { authenticated: false }
        }

        return {
            authenticated: true,
            role: user.role ?? undefined,
            userId: user.id ?? undefined,
        }
    },
})

export const useSendOtp = createMutation<SendOtpResponse, string>({
    mutationKey: ['send-otp'],
    mutationFn: async (phoneNumber: string) => {
        const response = await client.v1.v1AuthSendOtp({ mobilenumber: phoneNumber })
        return response.data
    },
    onSuccess: () => {
        showSuccessMessage('OTP sent successfully')
    },
    onError: handleMutationError,
})

export const useVerifyOtp = createMutation<VerifyOtpResponse, VerifyOtpVariables>({
    mutationKey: ['verify-otp'],
    mutationFn: async ({ phoneNumber, otp }: VerifyOtpVariables) => {
        const response = await client.v1.v1AuthVerifyOtp({ mobilenumber: phoneNumber, otp })
        return response.data
    },
    onSuccess: (data, variables) => {
        if (!isVerifiedOtpResponse(data)) {
            return
        }

        signIn(createAuthToken(data, variables.phoneNumber))
        showSuccessMessage('OTP verified successfully')
    },
    onError: handleMutationError,
})
