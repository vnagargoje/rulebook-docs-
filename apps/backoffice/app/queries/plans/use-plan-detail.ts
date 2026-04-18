import { useQuery } from '@tanstack/react-query'
import { v1PlansGetPlanById } from '~/services/api/sdk'
import { planKeys } from './keys'
import type { PlanItem } from './use-plans'

export type PlanDetail = PlanItem

export function useGetPlanById(id: string | undefined) {
    return useQuery({
        queryKey: planKeys.detail(id!),
        queryFn: async () => {
            const response = await v1PlansGetPlanById(id!)
            return response.data
        },
        enabled: !!id,
    })
}
