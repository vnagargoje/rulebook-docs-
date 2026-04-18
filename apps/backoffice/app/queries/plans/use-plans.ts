import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { v1PlansGetPlans } from '~/services/api/sdk'
import { planKeys } from './keys'

export type PlansListParams = Parameters<typeof v1PlansGetPlans>[0]
export type PlansListResponse = Awaited<ReturnType<typeof v1PlansGetPlans>>['data']
export type PlanItem = PlansListResponse['data'][number]

export function usePlans(params?: PlansListParams) {
    return useQuery({
        queryKey: planKeys.list(params),
        queryFn: async () => {
            const response = await v1PlansGetPlans(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
