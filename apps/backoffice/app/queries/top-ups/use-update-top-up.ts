import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v1TopUpsAdminUpdateTopUp } from '~/services/api/sdk'
import { topUpKeys } from './keys'

export type UpdateTopUpPayload = Parameters<typeof v1TopUpsAdminUpdateTopUp>[1]

export function useUpdateTopUp() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateTopUpPayload }) => {
            const response = await v1TopUpsAdminUpdateTopUp(id, data)
            return response.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: topUpKeys.all })
            queryClient.invalidateQueries({ queryKey: topUpKeys.detail(variables.id) })
        },
    })
}
