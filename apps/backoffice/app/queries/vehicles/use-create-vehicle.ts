import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1VehiclesCreateOneVehicleBody } from '~/services/api/codegen/Api'
import { v1VehiclesCreateOneVehicle } from '~/services/api/sdk'
import { vehicleKeys } from './keys'

export type CreateVehiclePayload = V1VehiclesCreateOneVehicleBody

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
