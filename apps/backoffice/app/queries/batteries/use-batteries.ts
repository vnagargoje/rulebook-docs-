import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { V1BatteriesGetManyBatteriesResponse } from '~/services/api/codegen/Api'
import { v1BatteriesGetManyBatteries } from '~/services/api/sdk'
import { batteryKeys } from './keys'

export type BatteriesListParams = NonNullable<Parameters<typeof v1BatteriesGetManyBatteries>[0]>
export type BatteriesListResponse = V1BatteriesGetManyBatteriesResponse
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
