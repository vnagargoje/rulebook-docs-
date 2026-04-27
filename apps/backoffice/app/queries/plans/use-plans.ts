import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { V1PlansGetPlansResponse } from '~/services/api/codegen/Api'
import { v1PlansGetPlans } from '~/services/api/sdk'
import { planKeys } from './keys'

export type PlansListParams = NonNullable<Parameters<typeof v1PlansGetPlans>[0]>
export type PlansListResponse = V1PlansGetPlansResponse
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
