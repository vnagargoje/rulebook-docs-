import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { v1StationsGetManyStations } from '~/services/api/sdk'
import { stationKeys } from './keys'

export type StationsListParams = Parameters<typeof v1StationsGetManyStations>[0]
export type StationsListResponse = Awaited<ReturnType<typeof v1StationsGetManyStations>>['data']
export type StationItem = StationsListResponse['data'][number]

export function useStations(params?: StationsListParams) {
    return useQuery({
        queryKey: stationKeys.list(params),
        queryFn: async () => {
            const response = await v1StationsGetManyStations(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
