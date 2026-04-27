import { createMutation, createQuery } from 'react-query-kit'

import { showError } from '@/components/ui'
import { client } from '@/lib/api/client'
import type {
    V1UsersGetOneUserResponse,
    V1UsersPatchOneUserBody,
    V1UsersPatchOneUserResponse,
} from '@/services/api/codegen/Api'

type CustomerProfile = V1UsersGetOneUserResponse

type UpdateCustomerProfileVariables = {
    id: string
    data: V1UsersPatchOneUserBody
}

export type { CustomerProfile, UpdateCustomerProfileVariables }

export const useCustomerProfile = createQuery<CustomerProfile>({
    queryKey: ['customer-profile'],
    fetcher: async () => {
        const response = await client.v1.v1UsersGetOneUser('me')
        return response.data
    },
})

export const useUpdateCustomerProfile = createMutation<
    V1UsersPatchOneUserResponse,
    UpdateCustomerProfileVariables
>({
    mutationKey: ['update-customer-profile'],
    mutationFn: async ({ id, data }) => {
        const response = await client.v1.v1UsersPatchOneUser(id, data)
        return response.data
    },
    onError: (error) => {
        showError(error)
    },
})
