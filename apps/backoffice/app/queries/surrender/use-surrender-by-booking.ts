import { useQuery } from '@tanstack/react-query'
import { v1VehicleSurrenderGetAllSurrenders } from '~/services/api/sdk'
import { surrenderKeys } from './keys'
import type { SurrenderListItem } from './use-surrenders'

export function useSurrenderByBookingId(bookingId: string | undefined) {
    return useQuery({
        queryKey: surrenderKeys.detail(bookingId!),
        queryFn: async () => {
            const response = await v1VehicleSurrenderGetAllSurrenders({
                'filter.bookingId': [`$eq:${bookingId}`],
                limit: 1,
            })
            return response.data.data[0] as SurrenderListItem | undefined
        },
        enabled: !!bookingId,
    })
}
