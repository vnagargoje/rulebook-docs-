import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '~/services/api/sdk'
import { kycKeys } from './keys'

export type UserKycRecord = {
    id: string
    documentId: string
    type: string
    status: string
    notes?: string | null
    attemptCount?: number
    verifiedAt?: string | null
    createdAt?: string
    updatedAt?: string
}

export function useCustomerKyc(userId?: string) {
    return useQuery({
        queryKey: kycKeys.list({ userId: userId ?? '' }),
        queryFn: async () => {
            const response = await api.instance.get<{ data: UserKycRecord[] }>('/v1/kyc/all', {
                params: {
                    'filter.userId': `$eq:${userId}`,
                    limit: 50,
                },
            })
            return response.data
        },
        placeholderData: keepPreviousData,
        enabled: !!userId,
    })
}
