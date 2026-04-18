import xior, { type XiorInterceptorRequestConfig } from 'xior'
import Env from '../../../env'
import { getAuthToken } from '@/stores/auth.store'
import type { SendOtpPayload, VerifyOtpPayload } from '@/types/auth/auth.types'

const apiClient = xior.create({
    baseURL: Env.EXPO_PUBLIC_API_URL,
})

apiClient.interceptors.request.use(async (config: XiorInterceptorRequestConfig) => {
    const authToken = getAuthToken()

    if (authToken?.access && !config.headers?.Authorization) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${authToken.access}`,
        }
    }

    return config
})

export const client = {
    auth: {
        sendOtp: (phoneNumber: string) =>
            apiClient.post('/v1/auth/otp/send', { mobilenumber: phoneNumber } satisfies SendOtpPayload),
        verifyOtp: (phoneNumber: string, otp: string) =>
            apiClient.post('/v1/auth/otp/verify', { mobilenumber: phoneNumber, otp } satisfies VerifyOtpPayload),
    },
    raw: apiClient,
}
