import { createQuery } from 'react-query-kit'

import { client } from '@/lib/api/client'
import type {
    V1BookingsGetAllBookingsResponse,
    V1BookingsGetBookingByIdResponse,
} from '@/services/api/codegen/Api'

type BookingsResponse = V1BookingsGetAllBookingsResponse
type Booking = V1BookingsGetBookingByIdResponse

export type { Booking, BookingsResponse }

export const useBookings = createQuery<BookingsResponse, { status?: string | string[] } | void>({
    queryKey: ['bookings'],
    fetcher: async (variables) => {
        const status = variables?.status
        let filterStatus: NonNullable<Parameters<typeof client.v1.v1BookingsGetAllBookings>[0]>['filter.status']
        if (Array.isArray(status) && status.length > 0) {
            filterStatus = [`$in:${status.join(',')}`]
        } else if (typeof status === 'string') {
            filterStatus = [`$eq:${status}`]
        }
        const response = await client.v1.v1BookingsGetAllBookings({
            page: 1,
            limit: 50,
            sortBy: ['createdAt:DESC'],
            ...(filterStatus ? { 'filter.status': filterStatus } : {}),
        })
        return response.data
    },
})

export const useBookingById = createQuery<Booking, { id: string }>({
    queryKey: ['booking'],
    fetcher: async ({ id }) => {
        const response = await client.v1.v1BookingsGetBookingById(id)
        return response.data
    },
})
