import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v1VehiclesUpdateOneVehicle } from '~/services/api/sdk'
import { vehicleKeys } from './keys'

export type UpdateVehiclePayload = Parameters<typeof v1VehiclesUpdateOneVehicle>[1]

export function useUpdateVehicle() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateVehiclePayload }) => {
            const response = await v1VehiclesUpdateOneVehicle(id, data)
            return response.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.all })
            queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(variables.id) })
        },
    })
}
