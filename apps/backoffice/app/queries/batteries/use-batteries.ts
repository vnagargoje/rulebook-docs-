import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { v1BatteriesGetManyBatteries } from '~/services/api/sdk'
import { batteryKeys } from './keys'

export type BatteriesListParams = Parameters<typeof v1BatteriesGetManyBatteries>[0]
export type BatteriesListResponse = Awaited<ReturnType<typeof v1BatteriesGetManyBatteries>>['data']
export type BatteryItem = BatteriesListResponse['data'][number]

export function useBatteries(params?: BatteriesListParams) {
    return useQuery({
        queryKey: batteryKeys.list(params),
        queryFn: async () => {
            const response = await v1BatteriesGetManyBatteries(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
