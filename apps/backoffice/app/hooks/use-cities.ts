import { createQuery } from 'react-query-kit'
import { v1CitiesListManyCities } from '~/services/api/sdk'

export const useCities = createQuery({
    queryKey: ['cities'],
    fetcher: async (variables?: Parameters<typeof v1CitiesListManyCities>[0]) => {
        const { data } = await v1CitiesListManyCities(variables)
        return data
    },
})
