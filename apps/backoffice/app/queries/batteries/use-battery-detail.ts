import { useQuery } from '@tanstack/react-query'
import type { V1BatteriesGetOneBatteryResponse } from '~/services/api/codegen/Api'
import { v1BatteriesGetOneBattery } from '~/services/api/sdk'
import { batteryKeys } from './keys'

export type BatteryDetail = V1BatteriesGetOneBatteryResponse

export function useGetBatteryById(id: string | undefined) {
    return useQuery({
        queryKey: batteryKeys.detail(id!),
        queryFn: async () => {
            const response = await v1BatteriesGetOneBattery(id!)
            return response.data
        },
        enabled: !!id,
    })
}
