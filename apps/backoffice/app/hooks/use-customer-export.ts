import { createMutation } from 'react-query-kit'
import { toast } from 'sonner'
import { v1UsersGetManyUsers } from '~/services/api/sdk'
import { buildExportQueryParams, formatCustomerForExport, generateExcelFile } from '~/lib/export.utils'

export type CustomerExportFilters = {
    dateFilter: string
    statusFilter: string
}

export const useCustomerExport = createMutation<void, CustomerExportFilters, Error>({
    mutationFn: async ({ dateFilter }) => {
        const exportParams = buildExportQueryParams(undefined, dateFilter)
        // Customer specific role
        exportParams['filter.roles.name'] = ['$eq:customer']
        
        const response = await v1UsersGetManyUsers(exportParams)
        const exportData = response.data?.data
        
        if (!exportData || exportData.length === 0) {
            throw new Error('No records available for the selected period.')
        }

        const formattedData = exportData.map(formatCustomerForExport)
        
        generateExcelFile(formattedData, 'Customers', 'customers', dateFilter)
    },
    onSuccess: () => {
        toast.success('Export successful.')
    },
    onError: (error) => {
        if (error.message === 'No records available for the selected period.') {
            toast.error(error.message)
        } else {
            toast.error('Failed to export customers.')
        }
    }
})
