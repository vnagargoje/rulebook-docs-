import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'

import {
    KYC_STATUS_QUERY_KEY,
    fetchKycStatus,
    getFirstIncompleteKycRoute,
    getStepState,
    useKycStatus,
    type KycStepState,
} from '@/queries/customer/kyc.query'
import { MY_PROFILE_QUERY_KEY } from '@/queries/profile'

export function useKycFlow() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: kycStatus, isLoading } = useKycStatus()

    const aadhaarState: KycStepState = getStepState(kycStatus?.aadhaar)
    const panState: KycStepState = getStepState(kycStatus?.pan)
    const licenseState: KycStepState = getStepState(kycStatus?.license)

    const refreshAndNavigate = useCallback(
        async (currentRoute: string): Promise<boolean> => {
            const nextStatus = await queryClient.fetchQuery({
                queryKey: [...KYC_STATUS_QUERY_KEY],
                queryFn: fetchKycStatus,
            })
            const nextRoute = getFirstIncompleteKycRoute(nextStatus)
            if (nextRoute !== currentRoute) {
                router.replace(nextRoute as never)
                return true
            }
            return false
        },
        [queryClient, router],
    )

    const navigateToNext = useCallback(
        async (nextRoute: string) => {
            await queryClient.invalidateQueries({ queryKey: [...KYC_STATUS_QUERY_KEY] })
            await queryClient.invalidateQueries({ queryKey: [...MY_PROFILE_QUERY_KEY] })
            router.replace(nextRoute as never)
        },
        [queryClient, router],
    )

    return {
        kycStatus,
        isLoading,
        aadhaarState,
        panState,
        licenseState,
        refreshAndNavigate,
        navigateToNext,
    }
}
