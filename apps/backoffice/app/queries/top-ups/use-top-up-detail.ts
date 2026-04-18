import { useQuery } from '@tanstack/react-query'
import { v1TopUpsGetTopUpById } from '~/services/api/sdk'
import { topUpKeys } from './keys'
import type { TopUpItem } from './use-top-ups'

export type TopUpDetail = TopUpItem

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
