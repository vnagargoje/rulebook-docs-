import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { V1BookingsGetAllBookingsResponse } from '~/services/api/codegen/Api'
import { v1BookingsGetAllBookings } from '~/services/api/sdk'
import { bookingKeys } from './keys'

export type BookingsListParams = Parameters<typeof v1BookingsGetAllBookings>[0]
export type BookingsListResponse = V1BookingsGetAllBookingsResponse
export type BookingItem = BookingsListResponse['data'][number]

export function useBookings(params?: BookingsListParams) {
    return useQuery({
        queryKey: bookingKeys.list(params),
        queryFn: async () => {
            const response = await v1BookingsGetAllBookings(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
