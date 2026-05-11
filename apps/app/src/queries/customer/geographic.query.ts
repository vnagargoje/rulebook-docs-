import { createInfiniteQuery } from 'react-query-kit'

import { client } from '@/lib/api/client'
import type {
    V1CitiesListManyCitiesResponse,
    V1StatesListManyStatesResponse,
} from '@/services/api/codegen/Api'

const PAGE_LIMIT = 30

type StatesResponse = V1StatesListManyStatesResponse
type CitiesResponse = V1CitiesListManyCitiesResponse

type StatesPickerVariables = {
    search?: string
}

type CitiesPickerVariables = {
    stateId: string
    search?: string
}

export const useStatesPicker = createInfiniteQuery<StatesResponse, StatesPickerVariables>({
    queryKey: ['states-picker'],
    fetcher: async (
        variables,
        { pageParam }: { pageParam: number },
    ): Promise<StatesResponse> => {
        const search = variables.search?.trim()
        const response = await client.v1.v1StatesListManyStates({
            page: pageParam,
            limit: PAGE_LIMIT,
            sortBy: ['name:ASC'],
            ...(search
                ? {
                      searchBy: ['name'],
                      search,
                  }
                : {}),
        })

        return response.data
    },
    getNextPageParam: (lastPage: StatesResponse) => {
        const { currentPage, totalPages } = lastPage.meta
        return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
})

export const useCitiesPicker = createInfiniteQuery<CitiesResponse, CitiesPickerVariables>({
    queryKey: ['cities-picker'],
    fetcher: async (
        variables,
        { pageParam }: { pageParam: number },
    ): Promise<CitiesResponse> => {
        const search = variables.search?.trim()
        const response = await client.v1.v1CitiesListManyCities({
            page: pageParam,
            limit: PAGE_LIMIT,
            sortBy: ['name:ASC'],
            'filter.state.id': [`$eq:${variables.stateId}`],
            ...(search
                ? {
                      searchBy: ['name'],
                      search,
                  }
                : {}),
        })

        return response.data
    },
    getNextPageParam: (lastPage: CitiesResponse) => {
        const { currentPage, totalPages } = lastPage.meta
        return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
})
