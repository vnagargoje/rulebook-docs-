import { createInfiniteQuery, createQuery } from 'react-query-kit'

import { client } from '@/lib/api/client'
import type {
    V1StationsGetManyStationsResponse,
    V1StationsGetNearestSwapStationsResponse,
    V1StationsGetOneStationResponse,
} from '@/services/api/codegen/Api'

type StationsResponse = V1StationsGetManyStationsResponse
type Station = StationsResponse['data'][number]
type StationDetail = V1StationsGetOneStationResponse
type NearestSwapStationsResponse = V1StationsGetNearestSwapStationsResponse
type NearestSwapStation = NearestSwapStationsResponse[number]

export type { Station, StationDetail, StationsResponse, NearestSwapStation, NearestSwapStationsResponse }

export const useStations = createQuery<StationsResponse>({
    queryKey: ['stations'],
    fetcher: async () => {
        const response = await client.v1.v1StationsGetManyStations({
            page: 1,
            limit: 50,
            'filter.type': ['$eq:hub_station'],
        })
        return response.data
    },
})

export const useStationById = createQuery<StationDetail, { id: string }>({
    queryKey: ['station'],
    fetcher: async ({ id }) => {
        const response = await client.v1.v1StationsGetOneStation(id)
        return response.data
    },
})

export const useVehicleStations = createQuery<StationsResponse>({
    queryKey: ['vehicle-stations'],
    fetcher: async () => {
        const response = await client.v1.v1StationsGetManyStations({
            page: 1,
            limit: 50,
            'filter.type': ['$eq:vehicle_station'],
        })
        return response.data
    },
})

export const useSwapStations = createInfiniteQuery<StationsResponse, void>({
    queryKey: ['swap-stations'],
    fetcher: async (_variables, { pageParam }) => {
        const response = await client.v1.v1StationsGetManyStations({
            page: pageParam as number,
            limit: 20,
            'filter.type': ['$eq:swap_station'],
        })
        return response.data
    },
    getNextPageParam: (lastPage: StationsResponse) => {
        const { currentPage, totalPages } = lastPage.meta
        return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
})

export const useNearestSwapStations = createQuery<
    NearestSwapStationsResponse,
    { latitude: number; longitude: number }
>({
    queryKey: ['nearest-swap-stations'],
    fetcher: async ({ latitude, longitude }) => {
        const response = await client.v1.v1StationsGetNearestSwapStations({ latitude, longitude })
        return response.data
    },
})
