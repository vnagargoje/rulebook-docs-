import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v1VehiclesCreateOneVehicle } from '~/services/api/sdk'
import { vehicleKeys } from './keys'

export type CreateVehiclePayload = Parameters<typeof v1VehiclesCreateOneVehicle>[0]

export function useCreateVehicle() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateVehiclePayload) => {
            const response = await v1VehiclesCreateOneVehicle(data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.all })
        },
    })
}
