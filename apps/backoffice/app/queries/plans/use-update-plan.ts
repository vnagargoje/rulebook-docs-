import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v1PlansAdminUpdatePlan } from '~/services/api/sdk'
import { planKeys } from './keys'

export type UpdatePlanPayload = Parameters<typeof v1PlansAdminUpdatePlan>[1]

export function useUpdatePlan() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdatePlanPayload }) => {
            const response = await v1PlansAdminUpdatePlan(id, data)
            return response.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: planKeys.all })
            queryClient.invalidateQueries({ queryKey: planKeys.detail(variables.id) })
        },
    })
}
