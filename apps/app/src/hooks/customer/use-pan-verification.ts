import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import { showErrorMessage } from '@/components/ui'
import { useKycFlow } from '@/hooks/customer/use-kyc-flow'
import { usePanVerify } from '@/queries/customer/kyc.query'
import { panSchema, type PanFormValues } from '@/schema/kyc/kyc.schema'

const CURRENT_ROUTE = '/customer/kyc/pan'

export function usePanVerification() {
    const { panState, refreshAndNavigate, navigateToNext } = useKycFlow()
    const panVerify = usePanVerify()
    const isSubmittingRef = useRef(false)

    const formMethods = useForm<PanFormValues>({
        resolver: zodResolver(panSchema),
        mode: 'onChange',
        defaultValues: { pan: '' },
    })

    const handleSubmit = formMethods.handleSubmit(async (values) => {
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true

        try {
            Keyboard.dismiss()

            const result = await panVerify.mutateAsync({ pan: values.pan })

            if (result.success) {
                await navigateToNext('/customer/kyc/license')
            } else {
                const navigated = await refreshAndNavigate(CURRENT_ROUTE)
                if (!navigated) {
                    showErrorMessage(
                        result.message || 'PAN verification failed. Please check the number and try again.',
                    )
                }
            }
        } catch {
            const navigated = await refreshAndNavigate(CURRENT_ROUTE)
            if (!navigated) {
                showErrorMessage('PAN verification failed. Please try again.')
            }
        } finally {
            isSubmittingRef.current = false
        }
    })

    const handleContinueToLicense = useCallback(() => {
        navigateToNext('/customer/kyc/license')
    }, [navigateToNext])

    const isSubmitting = panVerify.isPending

    return {
        panState,
        formMethods,
        handleSubmit,
        handleContinueToLicense,
        isSubmitting,
    }
}
