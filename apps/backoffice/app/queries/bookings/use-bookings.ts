import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { v1BookingsGetMyBookings } from '~/services/api/sdk'
import { bookingKeys } from './keys'

export type BookingsListParams = Parameters<typeof v1BookingsGetMyBookings>[0]
export type BookingsListResponse = Awaited<ReturnType<typeof v1BookingsGetMyBookings>>['data']
export type BookingItem = BookingsListResponse['data'][number]

export function useBookings(params?: BookingsListParams) {
    return useQuery({
        queryKey: bookingKeys.list(params),
        queryFn: async () => {
            const response = await v1BookingsGetMyBookings(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
