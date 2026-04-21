import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { v1VehiclesGetManyVehicles } from '~/services/api/sdk'
import { vehicleKeys } from './keys'

export type VehiclesListParams = Parameters<typeof v1VehiclesGetManyVehicles>[0]
export type VehiclesListResponse = Awaited<ReturnType<typeof v1VehiclesGetManyVehicles>>['data']
export type VehicleItem = VehiclesListResponse['data'][number]

export function useVehicles(params?: VehiclesListParams) {
    return useQuery({
        queryKey: vehicleKeys.list(params),
        queryFn: async () => {
            const response = await v1VehiclesGetManyVehicles(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
