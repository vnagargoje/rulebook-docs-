import { useQuery } from '@tanstack/react-query'
import type { V1UsersGetOneUserResponse } from '~/services/api/codegen/Api'
import { v1UsersGetOneUser } from '~/services/api/sdk'
import { userKeys } from './keys'

export type UserDetail = V1UsersGetOneUserResponse

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