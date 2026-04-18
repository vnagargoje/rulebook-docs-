import { useQuery } from '@tanstack/react-query'
import { v1StatesListManyStates } from '~/services/api/sdk'

export const useStates = () => {
    return useQuery({
        queryKey: ['states'],
        queryFn: async () => {
            const response = await v1StatesListManyStates({ limit: 100, sortBy: ['name:ASC'] })
            return response.data.data
        },
        staleTime: Infinity,
    })
}
