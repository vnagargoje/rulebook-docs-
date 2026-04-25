import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1VehicleSurrenderSurrenderVehicleBody, V1VehicleSurrenderSurrenderVehicleResponse } from '~/services/api/codegen/Api'
import { v1VehicleSurrenderSurrenderVehicle } from '~/services/api/sdk'
import { surrenderKeys } from './keys'

export type SurrenderVehiclePayload = V1VehicleSurrenderSurrenderVehicleBody
export type SurrenderVehicleResult = V1VehicleSurrenderSurrenderVehicleResponse

export function useSurrenderVehicle() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            vehicleNumber,
            data,
        }: {
            vehicleNumber: string
            data: SurrenderVehiclePayload
        }) => {
            const response = await v1VehicleSurrenderSurrenderVehicle(vehicleNumber, data)
            return response.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: surrenderKeys.all })
            queryClient.invalidateQueries({ queryKey: surrenderKeys.detail(variables.vehicleNumber) })
        },
    })
}
