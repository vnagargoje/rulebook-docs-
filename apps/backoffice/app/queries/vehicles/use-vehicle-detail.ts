import { useQuery } from '@tanstack/react-query'
import { v1VehiclesGetOneVehicle } from '~/services/api/sdk'
import { vehicleKeys } from './keys'
import type { VehicleItem } from './use-vehicles'

export type VehicleDetail = VehicleItem

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
