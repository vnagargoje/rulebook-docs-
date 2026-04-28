import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { V1VehiclesGetManyVehiclesResponse } from '~/services/api/codegen/Api'
import { v1VehiclesGetManyVehicles } from '~/services/api/sdk'
import { vehicleKeys } from './keys'

export type VehiclesListParams = NonNullable<Parameters<typeof v1VehiclesGetManyVehicles>[0]>
export type VehiclesListResponse = V1VehiclesGetManyVehiclesResponse
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
