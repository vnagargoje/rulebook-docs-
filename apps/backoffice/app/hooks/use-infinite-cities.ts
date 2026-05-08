import { useInfiniteQuery } from '@tanstack/react-query'
import { v1CitiesListManyCities } from '~/services/api/sdk'
import type { V1CitiesListManyCitiesResponse } from '~/services/api/codegen/Api'

export function useInfiniteCities(stateId: string | undefined) {
    return useInfiniteQuery({
        queryKey: ['cities', 'infinite', stateId],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const response = await v1CitiesListManyCities({
                page: pageParam,
                limit: 100,
                sortBy: ['name:ASC'],
                'filter.state.id': [`$eq:${stateId}`],
            })

            return response.data
        },
        getNextPageParam: (lastPage: V1CitiesListManyCitiesResponse) => {
            const { currentPage, totalPages } = lastPage.meta

            return currentPage < totalPages ? currentPage + 1 : undefined
        },
        enabled: !!stateId,
        staleTime: Infinity,
    })
}
