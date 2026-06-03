import { createMutation } from 'react-query-kit'
import { toast } from 'sonner'
import { v1TransactionsGetTransactions } from '~/services/api/sdk'
import { buildExportQueryParams, formatTransactionForExport, generateExcelFile } from '~/lib/export.utils'

export type TransactionExportFilters = {
    dateFilter: string
    statusFilter: string
}

export const useTransactionExport = createMutation<void, TransactionExportFilters, Error>({
    mutationFn: async ({ dateFilter, statusFilter }) => {
        const exportParams = buildExportQueryParams(statusFilter, dateFilter)
        
        const response = await v1TransactionsGetTransactions(exportParams)
        const exportData = response.data?.data
        
        if (!exportData || exportData.length === 0) {
            throw new Error('No records available for the selected period.')
        }

        const formattedData = exportData.map(formatTransactionForExport)
        
        generateExcelFile(formattedData, 'Transactions', 'transactions', dateFilter)
    },
    onSuccess: () => {
        toast.success('Export successful.')
    },
    onError: (error) => {
        if (error.message === 'No records available for the selected period.') {
            toast.error(error.message)
        } else {
            toast.error('Failed to export transactions.')
        }
    }
})
