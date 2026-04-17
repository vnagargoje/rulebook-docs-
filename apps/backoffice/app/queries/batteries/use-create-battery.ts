import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v1BatteriesCreateOneBattery } from '~/services/api/sdk'
import { batteryKeys } from './keys'

export type CreateBatteryPayload = Parameters<typeof v1BatteriesCreateOneBattery>[0]

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
