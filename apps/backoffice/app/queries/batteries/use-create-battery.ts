import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1BatteriesCreateOneBatteryBody } from '~/services/api/codegen/Api'
import { v1BatteriesCreateOneBattery } from '~/services/api/sdk'
import { batteryKeys } from './keys'

export type CreateBatteryPayload = V1BatteriesCreateOneBatteryBody

export function useCreateBattery() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateBatteryPayload) => {
            const response = await v1BatteriesCreateOneBattery(data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: batteryKeys.all })
        },
    })
}
