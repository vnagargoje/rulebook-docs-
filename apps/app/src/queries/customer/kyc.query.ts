import { createMutation, createQuery } from 'react-query-kit'

import { showError } from '@/components/ui'
import { client } from '@/lib/api/client'
import type {
    AadhaarConnectResponse,
    AadhaarGenerateOtpBody,
    AadhaarGenerateOtpResponse,
    AadhaarReloadCaptchaResponse,
    AadhaarVerifyOtpBody,
    AadhaarVerifyOtpResponse,
    KycGetStatusResponse,
    LicenseGetResultResponse,
    LicenseInitiateBody,
    LicenseInitiateResponse,
    PanVerifyBody,
    PanVerifyResponse,
    V1UsersPatchOneUserResponse,
    V1UsersUpdateAddressesBody,
    V1UsersUpdateAddressesResponse,
} from '@/services/api/codegen/Api'

export const KYC_STATUS_QUERY_KEY = ['kyc-status'] as const

export function isKycComplete(status: KycGetStatusResponse | undefined): boolean {
    if (!status) return false
    const aadhaarOk = status.aadhaar?.status === 'approved' || status.aadhaar?.status === 'verified'
    const panOk = status.pan?.status === 'approved' || status.pan?.status === 'verified'
    const licenseOk = status.license?.status === 'approved' || status.license?.status === 'verified'
    return Boolean(aadhaarOk && panOk && licenseOk)
}

export function getFirstIncompleteKycRoute(status: KycGetStatusResponse | undefined): string {
    if (!status) return '/customer/kyc/aadhaar'
    const aadhaarOk = status.aadhaar?.status === 'approved' || status.aadhaar?.status === 'verified'
    const panOk = status.pan?.status === 'approved' || status.pan?.status === 'verified'
    const licenseOk = status.license?.status === 'approved' || status.license?.status === 'verified'
    if (!aadhaarOk) return '/customer/kyc/aadhaar'
    if (!panOk) return '/customer/kyc/pan'
    if (!licenseOk) return '/customer/kyc/license'
    return '/customer/kyc/profile'
}

export const useKycStatus = createQuery<KycGetStatusResponse>({
    queryKey: [...KYC_STATUS_QUERY_KEY],
    fetcher: async () => {
        const response = await client.v1.kycGetStatus()
        return response.data
    },
})

export const useAadhaarConnect = createMutation<AadhaarConnectResponse>({
    mutationKey: ['aadhaar-connect'],
    mutationFn: async () => {
        const response = await client.v1.aadhaarConnect()
        return response.data
    },
    onError: showError,
})

export const useAadhaarReloadCaptcha = createMutation<AadhaarReloadCaptchaResponse, { sessionId: string }>({
    mutationKey: ['aadhaar-reload-captcha'],
    mutationFn: async ({ sessionId }) => {
        const response = await client.v1.aadhaarReloadCaptcha({ sessionId })
        return response.data
    },
    onError: showError,
})

export const useAadhaarGenerateOtp = createMutation<AadhaarGenerateOtpResponse, AadhaarGenerateOtpBody>({
    mutationKey: ['aadhaar-generate-otp'],
    mutationFn: async (data) => {
        const response = await client.v1.aadhaarGenerateOtp(data)
        return response.data
    },
    onError: showError,
})

export const useAadhaarVerifyOtp = createMutation<AadhaarVerifyOtpResponse, AadhaarVerifyOtpBody>({
    mutationKey: ['aadhaar-verify-otp'],
    mutationFn: async (data) => {
        const response = await client.v1.aadhaarVerifyOtp(data)
        return response.data
    },
    onError: showError,
})

export const usePanVerify = createMutation<PanVerifyResponse, PanVerifyBody>({
    mutationKey: ['pan-verify'],
    mutationFn: async (data) => {
        const response = await client.v1.panVerify(data)
        return response.data
    },
    onError: showError,
})

export const useLicenseInitiate = createMutation<LicenseInitiateResponse, LicenseInitiateBody>({
    mutationKey: ['license-initiate'],
    mutationFn: async (data) => {
        const response = await client.v1.licenseInitiate(data)
        return response.data
    },
    onError: showError,
})

export const useLicenseGetResult = createMutation<LicenseGetResultResponse, { requestId: string }>({
    mutationKey: ['license-get-result'],
    mutationFn: async ({ requestId }) => {
        const response = await client.v1.licenseGetResult({ requestId })
        return response.data
    },
    onError: showError,
})

type UpdateAddressVariables = {
    lineOne: string
    lineTwo?: string
    pincode: string
    cityId?: string
}

export const useUpdateMyAddress = createMutation<V1UsersPatchOneUserResponse, UpdateAddressVariables>({
    mutationKey: ['update-my-address'],
    mutationFn: async (address) => {
        const response = await client.v1.v1UsersPatchOneUser('me', { address })
        return response.data
    },
    onError: showError,
})

export const useUpdateMyAddresses = createMutation<
    V1UsersUpdateAddressesResponse,
    V1UsersUpdateAddressesBody
>({
    mutationKey: ['update-my-addresses'],
    mutationFn: async (data) => {
        const response = await client.v1.v1UsersUpdateAddresses('me', data)
        return response.data
    },
    onError: showError,
})
