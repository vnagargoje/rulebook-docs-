import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { V1UsersGetManyUsersResponse } from '~/services/api/codegen/Api'
import { v1UsersGetManyUsers } from '~/services/api/sdk'
import { userKeys } from './keys'

export type UsersListParams = NonNullable<Parameters<typeof v1UsersGetManyUsers>[0]>
export type UsersListResponse = V1UsersGetManyUsersResponse
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