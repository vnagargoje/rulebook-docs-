import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v1UsersCreateOneUser } from '~/services/api/sdk'
import { userKeys } from './keys'

export type CreateUserPayload = Parameters<typeof v1UsersCreateOneUser>[0]

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