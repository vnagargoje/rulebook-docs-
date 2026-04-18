import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v1BatteriesUpdateOneBattery } from '~/services/api/sdk'
import { batteryKeys } from './keys'

export type UpdateBatteryPayload = Parameters<typeof v1BatteriesUpdateOneBattery>[1]

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
