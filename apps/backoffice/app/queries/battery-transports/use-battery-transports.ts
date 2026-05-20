import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { V1BatteryTransportsGetManyMovementsResponse } from '~/services/api/codegen/Api'
import { v1BatteryTransportsGetManyMovements } from '~/services/api/sdk'
import { batteryTransportKeys } from './keys'

export type BatteryTransportsParams = NonNullable<Parameters<typeof v1BatteryTransportsGetManyMovements>[0]>
export type BatteryTransportsResponse = V1BatteryTransportsGetManyMovementsResponse
export type BatteryTransportItem = BatteryTransportsResponse['data'][number]

export function useBatteryTransports(params?: BatteryTransportsParams) {
    return useQuery({
        queryKey: batteryTransportKeys.list(params),
        queryFn: async () => {
            const response = await v1BatteryTransportsGetManyMovements(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
