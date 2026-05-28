import { useQuery } from '@tanstack/react-query'
import { v1BookingsGetAllBookings } from '~/services/api/sdk'
import { bookingKeys } from './keys'

export function useRecentBookingsNotifications() {
    return useQuery({
        queryKey: [...bookingKeys.lists(), 'notifications'],
        queryFn: async () => {
            const response = await v1BookingsGetAllBookings({
                limit: 20,
                sortBy: ['createdAt:DESC'],
            })
            // Return only lightweight data to keep the navbar fast, excluding bookings with assigned vehicles
            return response.data.data
                .filter((booking) => !booking.vehicleId)
                .map((booking) => ({
                    id: booking.id,
                    createdAt: booking.createdAt,
                    stationName: booking.station?.name || 'Unknown Station',
                    customerFirstName: booking.userPlan?.user?.firstName || 'Unknown',
                    customerLastName: booking.userPlan?.user?.lastName || '',
                }))
        },
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    })
}
