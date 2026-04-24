import { createMutation, createQuery } from 'react-query-kit'

import { showError, showSuccessMessage } from '@/components/ui'
import { client } from '@/lib/api/client'
import type {
    V1TopUpsGetTopUpByIdResponse,
    V1TopUpsGetTopUpsResponse,
    V1UserPlansApplyTopUpBody,
    V1UserPlansApplyTopUpResponse,
} from '@/services/api/codegen/Api'

type TopUpsResponse = V1TopUpsGetTopUpsResponse
type TopUp = TopUpsResponse['data'][number]
type TopUpByIdResponse = V1TopUpsGetTopUpByIdResponse
type ApplyTopUpResponse = V1UserPlansApplyTopUpResponse

export type { ApplyTopUpResponse, TopUp, TopUpByIdResponse, TopUpsResponse }

export const useTopUps = createQuery<TopUpsResponse>({
    queryKey: ['top-ups'],
    fetcher: async () => {
        const response = await client.v1.v1TopUpsGetTopUps({
            page: 1,
            limit: 50,
            sortBy: ['price:ASC'],
        })
        return response.data
    },
})

export const useTopUpById = createQuery<TopUpByIdResponse, { id: string } | void>({
    queryKey: ['top-up'],
    fetcher: async (variables) => {
        if (!variables?.id) {
            throw new Error('Top-up id is required')
        }
        const response = await client.v1.v1TopUpsGetTopUpById(variables.id)
        return response.data
    },
})

export const useApplyTopUp = createMutation<ApplyTopUpResponse, V1UserPlansApplyTopUpBody>({
    mutationKey: ['apply-top-up'],
    mutationFn: async ({ topUpId, userPlanId }) => {
        const response = await client.v1.v1UserPlansApplyTopUp({ topUpId, userPlanId })
        return response.data
    },
    onSuccess: () => {
        showSuccessMessage('Top-up applied successfully!')
    },
    onError: (error) => {
        showError(error)
    },
})
