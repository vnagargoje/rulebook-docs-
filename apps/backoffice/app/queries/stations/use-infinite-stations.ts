import { useInfiniteQuery } from '@tanstack/react-query'
import { v1StationsGetManyStations } from '~/services/api/sdk'
import { stationKeys } from './keys'
import type { StationsListParams } from './use-stations'

const PAGE_SIZE = 20

export function useInfiniteStations(params?: Omit<StationsListParams, 'page' | 'limit'>) {
    return useInfiniteQuery({
        queryKey: [...stationKeys.lists(), 'infinite', params],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await v1StationsGetManyStations({ ...params, page: pageParam as number, limit: PAGE_SIZE })
            return response.data
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.meta
            return currentPage < totalPages ? currentPage + 1 : undefined
        },
    })
}
