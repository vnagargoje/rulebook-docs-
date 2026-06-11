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
        // First get the station ID for this manager
        const stationsResp = await client.v1.v1StationsGetManyStations({
            page: 1, limit: 1,
            'filter.managers.id': [`$eq:${managerId}`]
        })
        const stationId = stationsResp.data.data[0]?.id

        if (!stationId) {
            return { charged: 0, charging: 0, drained: 0, inTransit: 0, available: 0 }
        }

        const [drainedResp, inTransitCount, availableResp, chargedResp, chargingResp] = await Promise.all([
            client.v1.v1BatteriesGetManyBatteries({
                page: 1, limit: 1,
                'filter.stationId': [`$eq:${stationId}`],
                'filter.status': ['$eq:drained'],
            }),
            Promise.all([
                client.v1.v1BatteryTransportsGetManyMovements({
                    page: 1, limit: 50,
                    'filter.status': ['$eq:in_transit'],
                    'filter.toStationId': [`$eq:${stationId}`],
                }),
                client.v1.v1BatteryTransportsGetManyMovements({
                    page: 1, limit: 50,
                    'filter.status': ['$eq:in_transit'],
                    'filter.fromStationId': [`$eq:${stationId}`],
                }),
            ]).then(([inbound, outbound]) => {
                const inCount = inbound.data.data.reduce((acc, m) => acc + (m.batteryIds?.length || 0), 0)
                const outCount = outbound.data.data.reduce((acc, m) => acc + (m.batteryIds?.length || 0), 0)
                return inCount + outCount
            }).catch(() => 0),
            client.v1.v1BatteriesGetManyBatteries({
                page: 1, limit: 1,
                'filter.stationId': [`$eq:${stationId}`],
                'filter.status': ['$eq:available'],
            }),
            client.v1.v1BatteriesGetManyBatteries({
                page: 1, limit: 1,
                'filter.stationId': [`$eq:${stationId}`],
                'filter.status': ['$eq:charged'],
            }),
            client.v1.v1BatteriesGetManyBatteries({
                page: 1, limit: 1,
                'filter.stationId': [`$eq:${stationId}`],
                'filter.status': ['$eq:charging'],
            }),
        ])
        return {
            charged: chargedResp.data.meta.totalItems,
            charging: chargingResp.data.meta.totalItems,
            drained: drainedResp.data.meta.totalItems,
            inTransit: inTransitCount,
            available: availableResp.data.meta.totalItems,
        }
    },
})
