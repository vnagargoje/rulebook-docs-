import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { V1TransactionsGetTransactionsResponse } from '~/services/api/codegen/Api'
import { v1TransactionsGetTransactions } from '~/services/api/sdk'
import { transactionKeys } from './keys'

export type { PlanSnapshot, TopUpSnapshot } from '~/types/admin'
export type TransactionsListParams = Parameters<typeof v1TransactionsGetTransactions>[0]
export type TransactionsListResponse = V1TransactionsGetTransactionsResponse
export type TransactionItem = TransactionsListResponse['data'][number]

export function useTransactions(params?: TransactionsListParams) {
    return useQuery({
        queryKey: transactionKeys.list(params as Record<string, unknown>),
        queryFn: async () => {
            const response = await v1TransactionsGetTransactions(params)
            return response.data
        },
        placeholderData: keepPreviousData,
    })
}
