import { useQuery } from '@tanstack/react-query'
import { v1BookingsGetBookingById } from '~/services/api/sdk'
import { bookingKeys } from './keys'
import type { BookingItem } from './use-bookings'

export type BookingDetail = BookingItem

export function useGetBookingById(id: string | undefined) {
    return useQuery({
        queryKey: bookingKeys.detail(id!),
        queryFn: async () => {
            const response = await v1BookingsGetBookingById(id!)
            return response.data
        },
        enabled: !!id,
    })
}
