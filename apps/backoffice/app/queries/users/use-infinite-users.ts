import { useInfiniteQuery } from '@tanstack/react-query'
import { v1UsersGetManyUsers } from '~/services/api/sdk'
import { userKeys } from './keys'
import type { UsersListParams, UsersListResponse } from './use-users'

export type InfiniteUsersParams = Omit<UsersListParams, 'page'>

export function useInfiniteUsers(params?: InfiniteUsersParams) {
    return useInfiniteQuery({
        queryKey: userKeys.infiniteList(params),
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const response = await v1UsersGetManyUsers({
                ...params,
                page: pageParam,
            })

            return response.data
        },
        getNextPageParam: (lastPage: UsersListResponse) => {
            const { currentPage, totalPages } = lastPage.meta

            return currentPage < totalPages ? currentPage + 1 : undefined
        },
    })
}
