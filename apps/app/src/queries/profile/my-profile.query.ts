import { createMutation, createQuery } from 'react-query-kit'

import { showError } from '@/components/ui'
import { client } from '@/lib/api/client'
import type {
    V1UsersGetOneUserResponse,
    V1UsersPatchOneUserBody,
    V1UsersPatchOneUserResponse,
} from '@/services/api/codegen/Api'

export const MY_PROFILE_QUERY_KEY = ['my-profile'] as const

export type MyProfile = V1UsersGetOneUserResponse

export type UpdateMyProfileVariables = {
    data: V1UsersPatchOneUserBody
}

export const useMyProfile = createQuery<MyProfile>({
    queryKey: [...MY_PROFILE_QUERY_KEY],
    fetcher: async () => {
        const response = await client.v1.v1UsersGetOneUser('me')
        return response.data
    },
})

export const useUpdateMyProfile = createMutation<V1UsersPatchOneUserResponse, UpdateMyProfileVariables>({
    mutationKey: ['update-my-profile'],
    mutationFn: async ({ data }) => {
        const response = await client.v1.v1UsersPatchOneUser('me', data)
        return response.data
    },
    onError: (error) => {
        showError(error)
    },
})
