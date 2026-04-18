import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v1TopUpsAdminCreateTopUp } from '~/services/api/sdk'
import { topUpKeys } from './keys'

export type CreateTopUpPayload = Parameters<typeof v1TopUpsAdminCreateTopUp>[0]

export function useCreateTopUp() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateTopUpPayload) => {
            const response = await v1TopUpsAdminCreateTopUp(data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: topUpKeys.all })
        },
    })
}
