import { useQuery } from '@tanstack/react-query'
import { v1StationsGetOneStation } from '~/services/api/sdk'
import { stationKeys } from './keys'
import type { StationItem } from './use-stations'

export type StationDetail = StationItem

export function useGetStationById(id: string | undefined) {
    return useQuery({
        queryKey: stationKeys.detail(id!),
        queryFn: async () => {
            const response = await v1StationsGetOneStation(id!)
            return response.data
        },
        enabled: !!id,
    })
}
