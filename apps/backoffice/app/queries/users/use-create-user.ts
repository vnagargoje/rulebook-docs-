import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1UsersCreateOneUserBody } from '~/services/api/codegen/Api'
import { v1UsersCreateOneUser } from '~/services/api/sdk'
import { userKeys } from './keys'

export type CreateUserPayload = V1UsersCreateOneUserBody

export function useCreateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateUserPayload) => {
            const response = await v1UsersCreateOneUser(data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all })
        },
    })
}