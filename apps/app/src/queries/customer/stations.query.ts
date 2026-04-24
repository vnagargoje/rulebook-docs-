import { createQuery } from 'react-query-kit'

import { client } from '@/lib/api/client'
import type { V1StationsGetManyStationsResponse } from '@/services/api/codegen/Api'

type StationsResponse = V1StationsGetManyStationsResponse
type Station = StationsResponse['data'][number]

export type { Station, StationsResponse }

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
