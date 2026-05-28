import { useInfiniteQuery } from '@tanstack/react-query'
import { v1UserPlansGetMyPlans } from '~/services/api/sdk'
import { userPlanKeys, type V1UserPlansGetMyPlansParams } from './keys'

export function useInfiniteUserPlans(params?: Omit<NonNullable<V1UserPlansGetMyPlansParams>, 'page'>) {
    return useInfiniteQuery({
        queryKey: userPlanKeys.list(params),
        queryFn: async ({ pageParam = 1 }) => {
            const response = await v1UserPlansGetMyPlans({
                page: pageParam,
                ...params,
            })
            return response.data
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const meta = lastPage.meta
            if (meta.currentPage < meta.totalPages) {
                return meta.currentPage + 1
            }
            return undefined
        },
    })
}
