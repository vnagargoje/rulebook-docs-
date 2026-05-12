import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1UsersUpdateAddressesBody } from '~/services/api/codegen/Api'
import { v1UsersUpdateAddresses } from '~/services/api/sdk'
import { userKeys } from './keys'

export type UpdateUserAddressesPayload = V1UsersUpdateAddressesBody

export function useUpdateUserAddresses() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateUserAddressesPayload }) => {
            const response = await v1UsersUpdateAddresses(id, data)
            return response.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all })
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
        },
    })
}
