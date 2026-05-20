import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { V1BatterySwapsGetSwapHistoryResponse } from '~/services/api/codegen/Api'
import { v1BatterySwapsGetSwapHistory } from '~/services/api/sdk'
import { swapHistoryKeys } from './keys'

export type SwapHistoryParams = NonNullable<Parameters<typeof v1BatterySwapsGetSwapHistory>[0]>
export type SwapHistoryResponse = V1BatterySwapsGetSwapHistoryResponse
export type SwapHistoryItem = SwapHistoryResponse['data'][number]

export function useSwapHistory(params?: SwapHistoryParams) {
    return useQuery({
        queryKey: swapHistoryKeys.list(params),
        queryFn: async () => {
            const response = await v1BatterySwapsGetSwapHistory(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
