import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v1PlansAdminCreatePlan } from '~/services/api/sdk'
import { planKeys } from './keys'

export type CreatePlanPayload = Parameters<typeof v1PlansAdminCreatePlan>[0]

export function useCreatePlan() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreatePlanPayload) => {
            const response = await v1PlansAdminCreatePlan(data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: planKeys.all })
        },
    })
}
