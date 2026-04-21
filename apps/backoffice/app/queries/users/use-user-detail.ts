import { useQuery } from '@tanstack/react-query'
import { v1UsersGetOneUser } from '~/services/api/sdk'
import { userKeys } from './keys'
import type { UserItem } from './use-users'

export type UserDetail = UserItem

export function useGetUserById(id: string | undefined) {
    return useQuery({
        queryKey: userKeys.detail(id!),
        queryFn: async () => {
            const response = await v1UsersGetOneUser(id!)
            return response.data
        },
        enabled: !!id,
    })
}