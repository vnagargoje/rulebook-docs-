import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1BatteriesUpdateOneBatteryBody } from '~/services/api/codegen/Api'
import { v1BatteriesUpdateOneBattery } from '~/services/api/sdk'
import { batteryKeys } from './keys'

export type UpdateBatteryPayload = V1BatteriesUpdateOneBatteryBody

export function useUpdateBattery() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateBatteryPayload }) => {
            const response = await v1BatteriesUpdateOneBattery(id, data)
            return response.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: batteryKeys.all })
            queryClient.invalidateQueries({ queryKey: batteryKeys.detail(variables.id) })
        },
    })
}
