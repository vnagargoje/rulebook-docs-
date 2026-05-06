import { useInfiniteQuery } from '@tanstack/react-query'
import { v1VehiclesGetManyVehicles } from '~/services/api/sdk'
import { vehicleKeys } from './keys'
import type { VehiclesListParams } from './use-vehicles'

const PAGE_SIZE = 20

export function useInfiniteVehicles(params?: Omit<VehiclesListParams, 'page' | 'limit'>) {
    return useInfiniteQuery({
        queryKey: [...vehicleKeys.lists(), 'infinite', params],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await v1VehiclesGetManyVehicles({ ...params, page: pageParam as number, limit: PAGE_SIZE })
            return response.data
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.meta
            return currentPage < totalPages ? currentPage + 1 : undefined
        },
    })
}
