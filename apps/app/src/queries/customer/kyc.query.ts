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
    KycApplyManualBody,
    KycApplyManualResponse,
    KycGetStatusResponse,
    LicenseGetResultResponse,
    LicenseInitiateBody,
    LicenseInitiateResponse,
    PanVerifyBody,
    PanVerifyResponse,
    V1UsersUpdateAddressesBody,
    V1UsersUpdateAddressesResponse,
} from '@/services/api/codegen/Api'
import { MAX_KYC_ATTEMPTS } from '@yugo/shared'

export const KYC_STATUS_QUERY_KEY = ['kyc-status'] as const

type KycStep = NonNullable<KycGetStatusResponse[keyof KycGetStatusResponse]>

const VERIFIED_STATUSES = ['approved', 'verified'] as const
const DONE_STATUSES = ['approved', 'verified', 'manual_verification_requested'] as const

function getKycSteps(status: KycGetStatusResponse | undefined): Array<KycStep | null> {
    if (!status) return []
    return [status.aadhaar, status.pan, status.license]
}

function hasStatus(step: { status: string } | null | undefined, statuses: readonly string[]): boolean {
    return !!step && statuses.includes(step.status)
}

function isAttemptLimitReached(step: KycStep | null | undefined): boolean {
    if (!step) return false
    return !hasStatus(step, VERIFIED_STATUSES) && (step.attemptCount ?? 0) >= MAX_KYC_ATTEMPTS
}

function isStepDone(step: KycStep | null | undefined): boolean {
    if (!step) return false
    return hasStatus(step, DONE_STATUSES) || isAttemptLimitReached(step)
}

export function isKycComplete(status: KycGetStatusResponse | undefined): boolean {
    if (!status) return false
    return getKycSteps(status).every((step) => hasStatus(step, VERIFIED_STATUSES))
}

export function hasRequestedManualVerification(status: KycGetStatusResponse | undefined): boolean {
    return getKycSteps(status).some((step) => hasStatus(step, ['manual_verification_requested']))
}

export function getFailedKycDocumentIds(status: KycGetStatusResponse | undefined): string[] {
    return getKycSteps(status)
        .filter((step): step is KycStep => Boolean(step?.id))
        .filter(isAttemptLimitReached)
        .map((step) => step.id)
}

export function getFirstIncompleteKycRoute(status: KycGetStatusResponse | undefined): string {
    if (!status) return '/customer/kyc/aadhaar'

    if (!isStepDone(status.aadhaar)) return '/customer/kyc/aadhaar'
    if (!isStepDone(status.pan)) return '/customer/kyc/pan'
    if (!isStepDone(status.license)) return '/customer/kyc/license'

    if (hasRequestedManualVerification(status) || getFailedKycDocumentIds(status).length > 0) {
        return '/customer/kyc/manual-verification'
    }

    return '/customer/kyc/profile'
}

export async function fetchKycStatus(): Promise<KycGetStatusResponse> {
    const response = await client.v1.kycGetStatus()
    return response.data
}

export const useKycStatus = createQuery<KycGetStatusResponse>({
    queryKey: [...KYC_STATUS_QUERY_KEY],
    fetcher: fetchKycStatus,
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

export const useUpdateMyAddresses = createMutation<V1UsersUpdateAddressesResponse, V1UsersUpdateAddressesBody>({
    mutationKey: ['update-my-addresses'],
    mutationFn: async (data) => {
        const response = await client.v1.v1UsersUpdateAddresses('me', data)
        return response.data
    },
    onError: showError,
})

export const useKycApplyManual = createMutation<KycApplyManualResponse, { id: string; data: KycApplyManualBody }>({
    mutationKey: ['kyc-apply-manual'],
    mutationFn: async ({ id, data }) => {
        const response = await client.v1.kycApplyManual(id, data)
        return response.data
    },
    onError: showError,
})
