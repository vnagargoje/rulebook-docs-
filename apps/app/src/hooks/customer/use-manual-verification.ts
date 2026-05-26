import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'

import { showErrorMessage, showSuccessMessage } from '@/components/ui'
import {
    KYC_STATUS_QUERY_KEY,
    getFailedKycDocumentIds,
    hasRequestedManualVerification,
    useKycApplyManual,
    useKycStatus,
} from '@/queries/customer/kyc.query'

export function useManualVerification() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: kycStatus, isLoading } = useKycStatus()
    const applyManual = useKycApplyManual()

    const [isUnderReview, setIsUnderReview] = useState(false)
    const isSubmittingRef = useRef(false)

    useEffect(() => {
        if (!isUnderReview) return

        const timeoutId = setTimeout(() => {
            router.replace('/customer/kyc/profile')
        }, 2500)

        return () => clearTimeout(timeoutId)
    }, [isUnderReview, router])

    const alreadyRequested = isUnderReview || hasRequestedManualVerification(kycStatus)
    const failedIds = getFailedKycDocumentIds(kycStatus)
    const needsManualVerification = failedIds.length > 0

    const handleApplyManual = useCallback(async () => {
        if (!kycStatus || isSubmittingRef.current || isUnderReview) return
        isSubmittingRef.current = true

        try {
            if (failedIds.length === 0) {
                showErrorMessage('No failed documents found to request manual verification.')
                return
            }

            for (const id of failedIds) {
                await applyManual.mutateAsync({ id, data: { notes: 'Requested by user from mobile app' } })
            }

            showSuccessMessage('Manual verification requested successfully.')
            await queryClient.invalidateQueries({ queryKey: [...KYC_STATUS_QUERY_KEY] })
            setIsUnderReview(true)
        } catch {
            showErrorMessage('Failed to request manual verification. Please try again.')
        } finally {
            isSubmittingRef.current = false
        }
    }, [kycStatus, isUnderReview, failedIds, applyManual, queryClient])

    const handleGoHome = useCallback(() => {
        router.replace('/customer')
    }, [router])

    const handleContinue = useCallback(() => {
        router.replace('/customer/kyc/profile')
    }, [router])

    return {
        isLoading,
        kycStatus,
        alreadyRequested,
        needsManualVerification,
        isUnderReview,
        isApplying: applyManual.isPending,
        handleApplyManual,
        handleGoHome,
        handleContinue,
    }
}
