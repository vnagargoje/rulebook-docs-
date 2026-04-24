import { useQuery } from '@tanstack/react-query'
import type { V1PlansGetPlanByIdResponse } from '~/services/api/codegen/Api'
import { v1PlansGetPlanById } from '~/services/api/sdk'
import { planKeys } from './keys'

export type PlanDetail = V1PlansGetPlanByIdResponse

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
