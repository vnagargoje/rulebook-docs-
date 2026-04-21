import { useQuery } from '@tanstack/react-query'
import { v1CitiesListManyCities } from '~/services/api/sdk'

export const useCities = (stateId: string | undefined) => {
    return useQuery({
        queryKey: ['cities', stateId],
        queryFn: async () => {
            const response = await v1CitiesListManyCities({
                limit: 100,
                sortBy: ['name:ASC'],
                'filter.state.id': [`$eq:${stateId}`],
            })
            return response.data.data
        },
        enabled: !!stateId,
        staleTime: Infinity,
    })
}
