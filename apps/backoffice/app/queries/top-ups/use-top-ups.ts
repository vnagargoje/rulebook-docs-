import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { v1TopUpsGetTopUps } from '~/services/api/sdk'
import { topUpKeys } from './keys'

export type TopUpsListParams = Parameters<typeof v1TopUpsGetTopUps>[0]
export type TopUpsListResponse = Awaited<ReturnType<typeof v1TopUpsGetTopUps>>['data']
export type TopUpItem = TopUpsListResponse['data'][number]

export function useTopUps(params?: TopUpsListParams) {
    return useQuery({
        queryKey: topUpKeys.list(params),
        queryFn: async () => {
            const response = await v1TopUpsGetTopUps(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
