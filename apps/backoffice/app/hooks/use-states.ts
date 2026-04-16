import { createQuery } from 'react-query-kit'
import { v1StatesListManyStates } from '~/services/api/sdk'

export const useStates = createQuery({
    queryKey: ['states'],
    fetcher: async (variables?: Parameters<typeof v1StatesListManyStates>[0]) => {
        const { data } = await v1StatesListManyStates(variables)
        return data
    },
})
