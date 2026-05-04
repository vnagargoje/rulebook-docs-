import { useQuery } from '@tanstack/react-query'
import type { V1TransactionsGetTransactionByIdResponse } from '~/services/api/codegen/Api'
import { v1TransactionsGetTransactionById } from '~/services/api/sdk'
import { transactionKeys } from './keys'

export type TransactionDetail = V1TransactionsGetTransactionByIdResponse

export function useTransactionDetail(id: string | undefined) {
    return useQuery({
        queryKey: transactionKeys.detail(id!),
        queryFn: async () => {
            const response = await v1TransactionsGetTransactionById(id!)
            return response.data
        },
        enabled: !!id,
    })
}
