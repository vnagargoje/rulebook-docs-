import { createQuery } from 'react-query-kit'

import { client } from '@/lib/api/client'
import type { V1BatteriesGetOneBatteryResponse } from '@/services/api/codegen/Api'

export const useGetBatteryById = createQuery<V1BatteriesGetOneBatteryResponse, { id: string }>({
    queryKey: ['battery', 'by-id'],
    fetcher: async ({ id }) => {
        const response = await client.v1.v1BatteriesGetOneBattery(id)
        return response.data
    },
})
