import { createMutation } from 'react-query-kit'
import { toast } from 'sonner'
import { v1BookingsGetAllBookings } from '~/services/api/sdk'
import { buildExportQueryParams, formatBookingForExport, generateExcelFile } from '~/lib/export.utils'

export type BookingExportFilters = {
    dateFilter: string
    statusFilter: string
}

export const useBookingExport = createMutation<void, BookingExportFilters, Error>({
    mutationFn: async ({ dateFilter, statusFilter }) => {
        const exportParams = buildExportQueryParams(statusFilter, dateFilter)
        
        const response = await v1BookingsGetAllBookings(exportParams)
        const exportData = response.data?.data
        
        if (!exportData || exportData.length === 0) {
            throw new Error('No records available for the selected period.')
        }

        const formattedData = exportData.map(formatBookingForExport)
        
        generateExcelFile(formattedData, 'Bookings', 'bookings', dateFilter)
    },
    onSuccess: () => {
        toast.success('Export successful.')
    },
    onError: (error) => {
        if (error.message === 'No records available for the selected period.') {
            toast.error(error.message)
        } else {
            toast.error('Failed to export bookings.')
        }
    }
})
