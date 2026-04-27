import { createMutation, createQuery } from 'react-query-kit'

import { showError, showSuccessMessage } from '@/components/ui'
import { client } from '@/lib/api/client'
import type {
    V1UserPlansGetMyPlansResponse,
    V1UserPlansPurchasePlanBody,
    V1UserPlansPurchasePlanResponse,
} from '@/services/api/codegen/Api'

type UserPlansResponse = V1UserPlansGetMyPlansResponse
type UserPlan = V1UserPlansPurchasePlanResponse

export type { UserPlan, UserPlansResponse }

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

export const usePurchasePlan = createMutation<UserPlan, V1UserPlansPurchasePlanBody>({
    mutationKey: ['purchase-plan'],
    mutationFn: async ({ planId }) => {
        const response = await client.v1.v1UserPlansPurchasePlan({ planId })
        return response.data
    },
    onSuccess: () => {
        showSuccessMessage('Plan purchased successfully!')
    },
    onError: (error) => {
        showError(error)
    },
})
