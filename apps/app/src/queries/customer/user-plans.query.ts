import { createMutation, createQuery } from 'react-query-kit'

import { showError } from '@/components/ui'
import { client } from '@/lib/api/client'
import type {
    V1UserPlansGetMyPlansResponse,
    V1UserPlansPurchasePlanResponse,
    V1UserPlansPurchasePlanBody,
    V1UserPlansVerifyPaymentResponse,
    V1UserPlansVerifyPaymentBody,
} from '@/services/api/codegen/Api'

export type PurchasePlanOrderResponse = V1UserPlansPurchasePlanResponse
export type VerifyPaymentVariables = V1UserPlansVerifyPaymentBody
export type VerifiedUserPlan = V1UserPlansVerifyPaymentResponse
export type UserPlansResponse = V1UserPlansGetMyPlansResponse
/** Kept so existing imports of UserPlan still compile */
export type UserPlan = V1UserPlansVerifyPaymentResponse

export const useMyPlans = createQuery<UserPlansResponse, { status?: string | string[] } | void>({
    queryKey: ['user-plans'],
    fetcher: async (variables) => {
        const status = variables?.status
        let filterStatus: NonNullable<Parameters<typeof client.v1.v1UserPlansGetMyPlans>[0]>['filter.status']
        if (Array.isArray(status) && status.length > 0) {
            filterStatus = [`$in:${status.join(',')}`]
        } else if (typeof status === 'string') {
            filterStatus = [`$eq:${status}`]
        }
        const response = await client.v1.v1UserPlansGetMyPlans({
            page: 1,
            limit: 50,
            sortBy: ['createdAt:DESC'],
            ...(filterStatus ? { 'filter.status': filterStatus } : {}),
        })
        return response.data
    },
})

export const useInitiatePlanPurchase = createMutation<PurchasePlanOrderResponse, V1UserPlansPurchasePlanBody>({
    mutationKey: ['initiate-plan-purchase'],
    mutationFn: async (data) => {
        const response = await client.v1.v1UserPlansPurchasePlan(data)
        return response.data
    },
    onError: (error) => {
        showError(error)
    },
})

export const useVerifyPayment = createMutation<VerifiedUserPlan, VerifyPaymentVariables>({
    mutationKey: ['verify-payment'],
    mutationFn: async (data) => {
        const response = await client.v1.v1UserPlansVerifyPayment(data)
        return response.data
    },
    onError: (error) => {
        showError(error)
    },
})
