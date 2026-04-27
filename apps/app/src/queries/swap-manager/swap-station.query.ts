import { client } from '@/lib/api/client'
import { V1StationsGetManyStationsResponse } from '@/services/api/codegen/Api'
import { createQuery } from 'react-query-kit'

export const useManagerSwapStation = createQuery<V1StationsGetManyStationsResponse['data'][0] | null, { managerId: string }>({
    queryKey: ['manager-swap-station'],
    fetcher: async ({ managerId }) => {
        // Return null if managerId is empty to prevent unnecessary API calls
        if (!managerId || managerId.trim() === '') {
            return null
        }

        const response = await client.v1.v1StationsGetManyStations({
            page: 1,
            limit: 1,
            'filter.type': ['$eq:swap_station'],
            'filter.managerId': [`$eq:${managerId}`],
        })
        
        // Return the station if found, otherwise return null
        return response.data.data[0] ?? null
    },
})
