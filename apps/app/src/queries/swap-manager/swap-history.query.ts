import { client } from '@/lib/api'
import { V1BatterySwapsGetSwapHistoryResponse } from '@/services/api/codegen/Api'
import { createInfiniteQuery } from 'react-query-kit'

export const useSwapHistory = createInfiniteQuery({
    queryKey: ['batteries', 'swap-history', 'manager'],
    fetcher: async (
        variables: { managerId: string },
        { pageParam }: { pageParam: number },
    ): Promise<V1BatterySwapsGetSwapHistoryResponse> => {
        const response = await client.v1
            .v1BatterySwapsGetSwapHistory({
                page: pageParam,
                limit: 20,
                'filter.swappedById': [`$eq:${variables.managerId}`],
            })
            .then(({ data }) => data)
        return response
    },
    getNextPageParam: (lastPage: V1BatterySwapsGetSwapHistoryResponse) => {
        const { currentPage, totalPages } = lastPage.meta
        return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
})
