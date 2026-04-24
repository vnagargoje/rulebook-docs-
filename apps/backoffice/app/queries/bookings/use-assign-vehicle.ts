import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { V1BookingsAdminAssignVehicleBody } from '~/services/api/codegen/Api'
import { v1BookingsAdminAssignVehicle } from '~/services/api/sdk'
import { bookingKeys } from './keys'

export type AssignVehiclePayload = V1BookingsAdminAssignVehicleBody

export function useAssignVehicle() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: AssignVehiclePayload }) => {
            const response = await v1BookingsAdminAssignVehicle(id, data)
            return response.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all })
            queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.id) })
        },
    })
}
