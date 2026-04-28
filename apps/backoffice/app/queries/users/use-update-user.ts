import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1UsersPatchOneUserBody } from '~/services/api/codegen/Api'
import { v1UsersPatchOneUser } from '~/services/api/sdk'
import { userKeys } from './keys'

export type UpdateUserPayload = V1UsersPatchOneUserBody

export function useUpdateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateUserPayload }) => {
            const response = await v1UsersPatchOneUser(id, data)
            return response.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all })
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
        },
    })
}