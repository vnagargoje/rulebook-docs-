import { useMutation, useQueryClient } from '@tanstack/react-query'
import { KycStatus } from '@yugo/shared'
import { api } from '~/services/api/sdk'
import { kycKeys } from './keys'
import { toast } from 'sonner'

export function useUpdateKycStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            status,
            notes,
        }: {
            id: string
            status: KycStatus
            notes?: string
        }) => {
            const response = await api.instance.patch(`/v1/kyc/${id}/status`, { status, notes })
            return response.data
        },
        onSuccess: () => {
            toast.success('KYC status updated successfully')
            queryClient.invalidateQueries({ queryKey: kycKeys.all })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update KYC status')
        },
    })
}
