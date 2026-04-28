import { createQuery } from 'react-query-kit'

import { client } from '@/lib/api/client'
import type { V1StationsGetManyStationsResponse, V1VehiclesGetManyVehiclesResponse } from '@/services/api/codegen/Api'

type StationsResponse = V1StationsGetManyStationsResponse
type VehiclesResponse = V1VehiclesGetManyVehiclesResponse

export type SwapStation = StationsResponse['data'][number]
export type TransportVehicle = VehiclesResponse['data'][number]

export const useGetSwapStations = createQuery<StationsResponse>({
    queryKey: ['hub-manager', 'swap-stations'],
    fetcher: async () => {
        const response = await client.v1.v1StationsGetManyStations({
            page: 1,
            limit: 100,
            'filter.type': ['$eq:swap_station'],
        })
        return response.data
    },
})

export const useGetHubStation = createQuery<StationsResponse | null, { managerId: string }>({
    queryKey: ['hub-manager', 'hub-station'],
    fetcher: async ({ managerId }) => {
        // Return null if managerId is empty to prevent unnecessary API calls
        if (!managerId || managerId.trim() === '') {
            return null
        }

        const response = await client.v1.v1StationsGetManyStations({
            page: 1,
            limit: 10,
            'filter.type': ['$eq:hub_station'],
            'filter.managerId': [`$eq:${managerId}`],
        })
        return response.data
    },
})

export const useGetTransportVehicles = createQuery<VehiclesResponse>({
    queryKey: ['hub-manager', 'transport-vehicles'],
    fetcher: async () => {
        const response = await client.v1.v1VehiclesGetManyVehicles({
            page: 1,
            limit: 100,
            'filter.type': ['$eq:transport'],
        })
        return response.data
    },
})
