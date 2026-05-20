import { client } from '@/lib/api/client'
import type { V1BatteryTransportsGetManyMovementsResponse } from '@/services/api/codegen/Api'
import { createQuery } from 'react-query-kit'

export type Movement = V1BatteryTransportsGetManyMovementsResponse['data'][number]

export const useGetMovements = createQuery<
    V1BatteryTransportsGetManyMovementsResponse,
    { 'filter.status'?: string[]; 'filter.toStationId'?: string[]; 'filter.fromStationId'?: string[]; limit?: number; page?: number } | undefined
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

export const useGetSentMovementsFromStation = createQuery<
    V1BatteryTransportsGetManyMovementsResponse,
    { fromStationId: string }
>({
    queryKey: ['hub-manager', 'movements-sent'],
    fetcher: async ({ fromStationId }) => {
        const response = await client.v1.v1BatteryTransportsGetManyMovements({
            'filter.fromStationId': [`$eq:${fromStationId}`],
            sortBy: ['createdAt:DESC'],
            limit: 50,
        })
        return response.data
    },
})

export const useGetReceivedMovementsToStation = createQuery<
    V1BatteryTransportsGetManyMovementsResponse,
    { toStationId: string }
>({
    queryKey: ['hub-manager', 'movements-received'],
    fetcher: async ({ toStationId }) => {
        const response = await client.v1.v1BatteryTransportsGetManyMovements({
            'filter.toStationId': [`$eq:${toStationId}`],
            'filter.status': ['$eq:delivered'],
            sortBy: ['createdAt:DESC'],
            limit: 50,
        })
        return response.data
    },
})
