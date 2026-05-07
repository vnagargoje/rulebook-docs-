import { client } from '@/lib/api/client'
import { V1BatteriesGetManyBatteriesResponse, V1BatteriesGetOneBatteryResponse } from '@/services/api/codegen/Api'
import { createInfiniteQuery, createQuery } from 'react-query-kit'

export const useHubBatteries = createInfiniteQuery({
    queryKey: ['hub-manager', 'batteries'],
    fetcher: async (
        variables: { managerId: string; search?: string },
        { pageParam }: { pageParam: number },
    ): Promise<V1BatteriesGetManyBatteriesResponse> => {
        const response = await client.v1
            .v1BatteriesGetManyBatteries({
                page: pageParam,
                limit: 20,
                'filter.station.managers.id': [`$eq:${variables.managerId}`],
                ...(variables.search?.trim()
                    ? { 'filter.batteryQrId': [`$ilike:${variables.search.trim()}`] }
                    : {}),
            })
            .then(({ data }) => data)
        return response
    },
    getNextPageParam: (lastPage: V1BatteriesGetManyBatteriesResponse) => {
        const { currentPage, totalPages } = lastPage.meta
        return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
})

export const useGetBatteryById = createQuery<V1BatteriesGetOneBatteryResponse, { id: string }>({
    queryKey: ['hub-manager', 'battery'],
    fetcher: async ({ id }) => {
        const response = await client.v1.v1BatteriesGetOneBattery(id)
        return response.data
    },
})
