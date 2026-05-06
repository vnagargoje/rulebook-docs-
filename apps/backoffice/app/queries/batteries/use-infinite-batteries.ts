import { useInfiniteQuery } from '@tanstack/react-query'
import { v1BatteriesGetManyBatteries } from '~/services/api/sdk'
import { batteryKeys } from './keys'
import type { BatteriesListParams } from './use-batteries'

const PAGE_SIZE = 20

export function useInfiniteBatteries(params?: Omit<BatteriesListParams, 'page' | 'limit'>) {
    return useInfiniteQuery({
        queryKey: [...batteryKeys.lists(), 'infinite', params],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await v1BatteriesGetManyBatteries({ ...params, page: pageParam as number, limit: PAGE_SIZE })
            return response.data
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.meta
            return currentPage < totalPages ? currentPage + 1 : undefined
        },
    })
}
