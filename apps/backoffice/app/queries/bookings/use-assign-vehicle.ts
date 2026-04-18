import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v1BookingsAdminAssignVehicle } from '~/services/api/sdk'
import { bookingKeys } from './keys'

export type AssignVehiclePayload = Parameters<typeof v1BookingsAdminAssignVehicle>[1]

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
