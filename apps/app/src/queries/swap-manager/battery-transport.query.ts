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
            'filter.status': ['$eq:available'],
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

export const useGetDeliveredMovementsToStation = createQuery<
    V1BatteryTransportsGetManyMovementsResponse,
    { toStationId: string }
>({
    queryKey: ['swap-manager', 'movements-delivered'],
    fetcher: async ({ toStationId }) => {
        const response = await client.v1.v1BatteryTransportsGetManyMovements({
            'filter.status': ['$eq:delivered'],
            'filter.toStationId': [`$eq:${toStationId}`],
            limit: 5,
            page: 1,
        })
        return response.data
    },
})

export const useGetSentMovements = createQuery<
    V1BatteryTransportsGetManyMovementsResponse,
    { fromStationId: string }
>({
    queryKey: ['swap-manager', 'movements-sent'],
    fetcher: async ({ fromStationId }) => {
        const response = await client.v1.v1BatteryTransportsGetManyMovements({
            'filter.fromStationId': [`$eq:${fromStationId}`],
            sortBy: ['createdAt:DESC'],
            limit: 50,
        })
        return response.data
    },
})

export const useGetReceivedMovements = createQuery<
    V1BatteryTransportsGetManyMovementsResponse,
    { toStationId: string }
>({
    queryKey: ['swap-manager', 'movements-received'],
    fetcher: async ({ toStationId }) => {
        const response = await client.v1.v1BatteryTransportsGetManyMovements({
            'filter.toStationId': [`$eq:${toStationId}`],
            sortBy: ['createdAt:DESC'],
            limit: 50,
        })
        return response.data
    },
})

export const useGetStationMovements = createQuery<
    V1BatteryTransportsGetManyMovementsResponse,
    { toStationId: string; status: string }
>({
    queryKey: ['swap-manager', 'station-movements'],
    fetcher: async ({ toStationId, status }) => {
        const response = await client.v1.v1BatteryTransportsGetManyMovements({
            'filter.toStationId': [`$eq:${toStationId}`],
            'filter.status': [`$eq:${status}`],
            sortBy: ['createdAt:DESC'],
            limit: 50,
        })
        return response.data
    },
})

export const useGetFromStationMovements = createQuery<
    V1BatteryTransportsGetManyMovementsResponse,
    { fromStationId: string; status: string }
>({
    queryKey: ['swap-manager', 'from-station-movements'],
    fetcher: async ({ fromStationId, status }) => {
        const response = await client.v1.v1BatteryTransportsGetManyMovements({
            'filter.fromStationId': [`$eq:${fromStationId}`],
            'filter.status': [`$eq:${status}`],
            sortBy: ['createdAt:DESC'],
            limit: 50,
        })
        return response.data
    },
})
