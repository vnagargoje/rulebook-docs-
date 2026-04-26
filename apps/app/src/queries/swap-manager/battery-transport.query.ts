import { createQuery } from 'react-query-kit'

import { client } from '@/lib/api/client'
import type {
    V1BatteryTransportsGetManyMovementsResponse,
    V1StationsGetManyStationsResponse,
    V1VehiclesGetManyVehiclesResponse,
} from '@/services/api/codegen/Api'

export type SMHubStation = V1StationsGetManyStationsResponse['data'][number]
export type SMTransportVehicle = V1VehiclesGetManyVehiclesResponse['data'][number]
export type SMMovement = V1BatteryTransportsGetManyMovementsResponse['data'][number]

export const useGetHubStations = createQuery<V1StationsGetManyStationsResponse>({
    queryKey: ['swap-manager', 'hub-stations'],
    fetcher: async () => {
        const response = await client.v1.v1StationsGetManyStations({
            page: 1,
            limit: 100,
            'filter.type': ['$eq:hub_station'],
        })
        return response.data
    },
})

export const useGetSMTransportVehicles = createQuery<V1VehiclesGetManyVehiclesResponse>({
    queryKey: ['swap-manager', 'transport-vehicles'],
    fetcher: async () => {
        const response = await client.v1.v1VehiclesGetManyVehicles({
            page: 1,
            limit: 100,
            'filter.type': ['$eq:transport'],
        })
        return response.data
    },
})

export const useGetInTransitMovementsToStation = createQuery<
    V1BatteryTransportsGetManyMovementsResponse,
    { toStationId: string }
>({
    queryKey: ['swap-manager', 'movements-inbound'],
    fetcher: async ({ toStationId }) => {
        const response = await client.v1.v1BatteryTransportsGetManyMovements({
            'filter.status': ['$eq:in_transit'],
            'filter.toStationId': [`$eq:${toStationId}`],
            limit: 100,
        })
        return response.data
    },
})
