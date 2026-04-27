import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { V1VehicleSurrenderGetAllSurrendersResponse } from '~/services/api/codegen/Api'
import { v1VehicleSurrenderGetAllSurrenders } from '~/services/api/sdk'
import { surrenderKeys } from './keys'

export type SurrenderListParams = Parameters<typeof v1VehicleSurrenderGetAllSurrenders>[0]
export type SurrenderListResponse = V1VehicleSurrenderGetAllSurrendersResponse
export type SurrenderListItem = SurrenderListResponse['data'][number]

export function useSurrenders(params?: SurrenderListParams) {
    return useQuery({
        queryKey: surrenderKeys.list(params as Record<string, unknown> | undefined),
        queryFn: async () => {
            const response = await v1VehicleSurrenderGetAllSurrenders(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
