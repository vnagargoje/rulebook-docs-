import { client } from '@/lib/api'
import { V1BatteriesGetManyBatteriesResponse } from '@/services/api/codegen/Api'
import { createQuery } from 'react-query-kit'

export const useBatteries = createQuery<V1BatteriesGetManyBatteriesResponse, { managerId: string }>({
    queryKey: ['batteries', 'list', 'manager'],
    fetcher: async ({ managerId }) => {
        const response = await client.v1
            .v1BatteriesGetManyBatteries({
                page: 1,
                limit: 100,
                'filter.station.managerId': [`$eq:${managerId}`],
            })
            .then(({ data }) => data)
        return response
    },
})
