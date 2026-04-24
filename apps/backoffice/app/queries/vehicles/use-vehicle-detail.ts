import { useQuery } from '@tanstack/react-query'
import type { V1VehiclesGetOneVehicleResponse } from '~/services/api/codegen/Api'
import { v1VehiclesGetOneVehicle } from '~/services/api/sdk'
import { vehicleKeys } from './keys'

export type VehicleDetail = V1VehiclesGetOneVehicleResponse

export function useGetVehicleById(id: string | undefined) {
    return useQuery({
        queryKey: vehicleKeys.detail(id!),
        queryFn: async () => {
            const response = await v1VehiclesGetOneVehicle(id!)
            return response.data
        },
        enabled: !!id,
    })
}
