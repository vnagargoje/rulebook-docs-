import { useQuery } from '@tanstack/react-query'
import type { V1BookingsGetBookingByIdResponse } from '~/services/api/codegen/Api'
import { v1BookingsGetBookingById } from '~/services/api/sdk'
import { bookingKeys } from './keys'

export type BookingDetail = V1BookingsGetBookingByIdResponse & {
    userId?: string
    startedAt?: string | null
    completedAt?: string | null
    cancelledAt?: string | null
    cancellationReason?: string | null
    userPlan: V1BookingsGetBookingByIdResponse['userPlan'] & {
        topUps?: Array<{
            id: string
            topUpId: string
            topUpSnapshot: Record<string, any>
            appliedAt: string
        }>
    }
}

export function useGetBookingById(id: string | undefined) {
    return useQuery({
        queryKey: bookingKeys.detail(id!),
        queryFn: async () => {
            const response = await v1BookingsGetBookingById(id!)
            return response.data as BookingDetail
        },
        enabled: !!id,
    })
}
