import { createQuery } from 'react-query-kit'

import { client } from '@/lib/api/client'
import type { V1PlansGetPlanByIdResponse, V1PlansGetPlansResponse } from '@/services/api/codegen/Api'

type PlansResponse = V1PlansGetPlansResponse
type Plan = V1PlansGetPlanByIdResponse

export type { Plan, PlansResponse }

export const usePlans = createQuery<PlansResponse>({
    queryKey: ['plans'],
    fetcher: async () => {
        const response = await client.v1.v1PlansGetPlans({
            page: 1,
            limit: 50,
            sortBy: ['price:ASC'],
        })
        return response.data
    },
})

export const usePlanById = createQuery<Plan, { id: string }>({
    queryKey: ['plan'],
    fetcher: async ({ id }) => {
        const response = await client.v1.v1PlansGetPlanById(id)
        return response.data
    },
})
