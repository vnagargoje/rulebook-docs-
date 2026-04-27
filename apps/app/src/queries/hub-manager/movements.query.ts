import { client } from '@/lib/api/client'
import type { V1BatteryTransportsGetManyMovementsResponse } from '@/services/api/codegen/Api'
import { createQuery } from 'react-query-kit'

export type Movement = V1BatteryTransportsGetManyMovementsResponse['data'][number]

export const useGetMovements = createQuery<
    V1BatteryTransportsGetManyMovementsResponse,
    { 'filter.status'?: string[]; limit?: number; page?: number } | undefined
>({
    queryKey: ['movements'],
    fetcher: async (params) => {
        const response = await client.v1.v1BatteryTransportsGetManyMovements(params)
        return response.data
    },
})

export const useGetInTransitMovements = createQuery<V1BatteryTransportsGetManyMovementsResponse>({
    queryKey: ['movements-in-transit'],
    fetcher: async () => {
        const response = await client.v1.v1BatteryTransportsGetManyMovements({
            'filter.status': ['$eq:in_transit'],
            limit: 100,
        })
        return response.data
    },
})
