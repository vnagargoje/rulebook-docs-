import { createMutation } from 'react-query-kit'
import { toast } from 'sonner'
import { v1UsersGetManyUsers } from '~/services/api/sdk'
import { buildExportQueryParams, formatEmployeeForExport, generateExcelFile } from '~/lib/export.utils'

export type EmployeeExportFilters = {
    dateFilter: string
    statusFilter: string
}

export const useEmployeeExport = createMutation<void, EmployeeExportFilters, Error>({
    mutationFn: async ({ dateFilter }) => {
        const exportParams = buildExportQueryParams(undefined, dateFilter)
        // Employee specific roles
        exportParams['filter.roles.name'] = ['$in:swap_manager,hub_manager,system_admin,system_user']
        
        const response = await v1UsersGetManyUsers(exportParams)
        const exportData = response.data?.data
        
        if (!exportData || exportData.length === 0) {
            throw new Error('No records available for the selected period.')
        }

        const formattedData = exportData.map(formatEmployeeForExport)
        
        generateExcelFile(formattedData, 'Employees', 'employees', dateFilter)
    },
    onSuccess: () => {
        toast.success('Export successful.')
    },
    onError: (error) => {
        if (error.message === 'No records available for the selected period.') {
            toast.error(error.message)
        } else {
            toast.error('Failed to export employees.')
        }
    }
})
