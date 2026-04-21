import { useQuery } from '@tanstack/react-query'
import { v1BatteriesGetOneBattery } from '~/services/api/sdk'
import { batteryKeys } from './keys'
import type { BatteryItem } from './use-batteries'

export type BatteryDetail = BatteryItem

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
