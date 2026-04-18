import { createMutation } from 'react-query-kit'
import { showError, showSuccessMessage } from '@/components/ui'
import { createAuthToken, isVerifiedOtpResponse } from '@/components/auth/auth.utils'
import { client } from '@/lib/api/client'
import { signIn } from '@/stores/auth.store'
import type { SendOtpResponse, VerifyOtpResponse, VerifyOtpVariables } from '@/types/auth/auth.types'

const handleMutationError = (error: unknown) => {
    showError(error)
}

export const useSendOtp = createMutation<{ data: SendOtpResponse }, string>({
    mutationKey: ['send-otp'],
    mutationFn: (phoneNumber: string) => client.auth.sendOtp(phoneNumber),
    onSuccess: () => {
        showSuccessMessage('OTP sent successfully')
    },
    onError: handleMutationError,
})

export const useVerifyOtp = createMutation<{ data: VerifyOtpResponse }, VerifyOtpVariables>({
    mutationKey: ['verify-otp'],
    mutationFn: ({ phoneNumber, otp }: VerifyOtpVariables) => client.auth.verifyOtp(phoneNumber, otp),
    onSuccess: (response, variables) => {
        if (!isVerifiedOtpResponse(response.data)) {
            showError('Invalid OTP response')
            return
        }

        signIn(createAuthToken(response.data, variables.phoneNumber))
        showSuccessMessage('OTP verified successfully')
    },
    onError: handleMutationError,
})
