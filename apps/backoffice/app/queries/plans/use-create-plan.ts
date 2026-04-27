import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1PlansAdminCreatePlanBody } from '~/services/api/codegen/Api'
import { v1PlansAdminCreatePlan } from '~/services/api/sdk'
import { planKeys } from './keys'

export type CreatePlanPayload = V1PlansAdminCreatePlanBody

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
