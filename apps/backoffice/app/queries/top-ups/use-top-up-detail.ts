import { useQuery } from '@tanstack/react-query'
import type { V1TopUpsGetTopUpByIdResponse } from '~/services/api/codegen/Api'
import { v1TopUpsGetTopUpById } from '~/services/api/sdk'
import { topUpKeys } from './keys'

export type TopUpDetail = V1TopUpsGetTopUpByIdResponse

export function useGetTopUpById(id: string | undefined) {
    return useQuery({
        queryKey: topUpKeys.detail(id!),
        queryFn: async () => {
            const response = await v1TopUpsGetTopUpById(id!)
            return response.data
        },
        enabled: !!id,
    })
}
