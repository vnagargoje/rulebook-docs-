import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { V1StationsGetManyStationsResponse } from '~/services/api/codegen/Api'
import { v1StationsGetManyStations } from '~/services/api/sdk'
import { stationKeys } from './keys'

export type StationsListParams = NonNullable<Parameters<typeof v1StationsGetManyStations>[0]>
export type StationsListResponse = V1StationsGetManyStationsResponse
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
