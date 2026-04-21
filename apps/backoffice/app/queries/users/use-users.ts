import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { v1UsersGetManyUsers } from '~/services/api/sdk'
import { userKeys } from './keys'

export type UsersListParams = Parameters<typeof v1UsersGetManyUsers>[0]
export type UsersListResponse = Awaited<ReturnType<typeof v1UsersGetManyUsers>>['data']
export type UserItem = UsersListResponse['data'][number]

export function useUsers(params?: UsersListParams) {
    return useQuery({
        queryKey: userKeys.list(params),
        queryFn: async () => {
            const response = await v1UsersGetManyUsers(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}