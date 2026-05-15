import { client } from '@/lib/api'
import { V1BatteriesGetManyBatteriesResponse, V1BatteriesGetOneBatteryResponse } from '@/services/api/codegen/Api'
import { createInfiniteQuery, createQuery } from 'react-query-kit'

export type StationBatteryCounts = {
    charged: number
    charging: number
    drained: number
    inTransit: number
    available: number
}

export const useBatteries = createInfiniteQuery({
    queryKey: ['swap-manager', 'batteries'],
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

export const useGetSwapBatteryById = createQuery<V1BatteriesGetOneBatteryResponse, { id: string }>({
    queryKey: ['swap-manager', 'battery'],
    fetcher: async ({ id }) => {
        const response = await client.v1.v1BatteriesGetOneBattery(id)
        return response.data
    },
})

export const useStationBatteryCounts = createQuery<StationBatteryCounts, { managerId: string }>({
    queryKey: ['swap-manager', 'battery-counts'],
    fetcher: async ({ managerId }) => {
        const [chargedResp, chargingResp, drainedResp, inTransitResp, availableResp] = await Promise.all([
            client.v1.v1BatteriesGetManyBatteries({
                page: 1, limit: 1,
                'filter.station.managers.id': [`$eq:${managerId}`],
                'filter.status': ['$eq:charged'],
            }),
            client.v1.v1BatteriesGetManyBatteries({
                page: 1, limit: 1,
                'filter.station.managers.id': [`$eq:${managerId}`],
                'filter.status': ['$eq:charging'],
            }),
            client.v1.v1BatteriesGetManyBatteries({
                page: 1, limit: 1,
                'filter.station.managers.id': [`$eq:${managerId}`],
                'filter.status': ['$eq:drained'],
            }),
            client.v1.v1BatteriesGetManyBatteries({
                page: 1, limit: 1,
                'filter.station.managers.id': [`$eq:${managerId}`],
                'filter.status': ['$eq:in_transit'],
            }),
            client.v1.v1BatteriesGetManyBatteries({
                page: 1, limit: 1,
                'filter.station.managers.id': [`$eq:${managerId}`],
                'filter.status': ['$eq:available'],
            }),
        ])
        return {
            charged: chargedResp.data.meta.totalItems,
            charging: chargingResp.data.meta.totalItems,
            drained: drainedResp.data.meta.totalItems,
            inTransit: inTransitResp.data.meta.totalItems,
            available: availableResp.data.meta.totalItems,
        }
    },
})
