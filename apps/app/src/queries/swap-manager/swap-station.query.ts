import { client } from '@/lib/api/client'
import { V1StationsGetManyStationsResponse } from '@/services/api/codegen/Api'
import { createQuery } from 'react-query-kit'

export const useManagerSwapStation = createQuery<V1StationsGetManyStationsResponse['data'][0], { managerId: string }>({
    queryKey: ['manager-swap-station'],
    fetcher: async ({ managerId }) => {
        const response = await client.v1.v1StationsGetManyStations({
            page: 1,
            limit: 1,
            'filter.type': ['$eq:swap_station'],
            'filter.managerId': [`$eq:${managerId}`],
        })
        return response.data.data[0]
    },
})
