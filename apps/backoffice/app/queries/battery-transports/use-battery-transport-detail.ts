import { useQuery } from '@tanstack/react-query'

import type { V1BatteryTransportsGetOneMovementResponse } from '~/services/api/codegen/Api'
import { v1BatteryTransportsGetOneMovement } from '~/services/api/sdk'
import { batteryTransportKeys } from './keys'

export type BatteryTransportDetail = V1BatteryTransportsGetOneMovementResponse

export function useBatteryTransportDetail(id: string | undefined) {
    return useQuery({
        queryKey: batteryTransportKeys.detail(id!),
        queryFn: async () => {
            const response = await v1BatteryTransportsGetOneMovement(id!)
            return response.data
        },
        enabled: !!id,
    })
}
