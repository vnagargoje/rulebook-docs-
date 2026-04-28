import { useQuery } from '@tanstack/react-query'
import type { V1VehicleSurrenderGetSurrenderDetailsResponse } from '~/services/api/codegen/Api'
import { v1VehicleSurrenderGetSurrenderDetails } from '~/services/api/sdk'
import { surrenderKeys } from './keys'

export type SurrenderDetails = V1VehicleSurrenderGetSurrenderDetailsResponse

export function useSurrenderDetails(vehicleNumber: string, enabled = true) {
    return useQuery({
        queryKey: surrenderKeys.detail(vehicleNumber),
        queryFn: async () => {
            const response = await v1VehicleSurrenderGetSurrenderDetails(vehicleNumber)
            return response.data
        },
        enabled: enabled && !!vehicleNumber,
    })
}
