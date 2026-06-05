import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import { showErrorMessage } from '@/components/ui'
import { useKycFlow } from '@/hooks/customer/use-kyc-flow'
import { getFirstIncompleteKycRoute, isAttemptLimitReached, usePanVerify } from '@/queries/customer/kyc.query'
import { panSchema, type PanFormValues } from '@/schema/kyc/kyc.schema'

const CURRENT_ROUTE = '/customer/kyc/pan'

export function usePanVerification() {
    const { panState, refreshStatus, navigateToNext } = useKycFlow()
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

            const deepvueStatus = result.data?.data?.status
            const deepvueCode = result.data?.code

            if (result.success && deepvueCode === 200 && deepvueStatus === 'VALID') {
                await navigateToNext('/customer/kyc/license')
            } else {
                const nextStatus = await refreshStatus()

                if (isAttemptLimitReached(nextStatus.pan)) {
                    showErrorMessage('Your PAN KYC attempt limit has been reached. Continue with Driving License.')
                    return
                }

                const nextRoute = getFirstIncompleteKycRoute(nextStatus)
                if (nextRoute !== CURRENT_ROUTE) {
                    await navigateToNext(nextRoute)
                } else {
                    const errorMsg = result.data?.message || result.message || 'PAN verification failed. Please check the number and try again.'
                    showErrorMessage(errorMsg)
                }
            }
        } catch (error: any) {
            const nextStatus = await refreshStatus()

            if (isAttemptLimitReached(nextStatus.pan)) {
                showErrorMessage('Your PAN KYC attempt limit has been reached. Continue with Driving License.')
                return
            }

            const nextRoute = getFirstIncompleteKycRoute(nextStatus)
            if (nextRoute !== CURRENT_ROUTE) {
                await navigateToNext(nextRoute)
            } else {
                const errorMessage = error?.response?.data?.message || 'PAN verification failed. Please try again.'
                showErrorMessage(typeof errorMessage === 'string' ? errorMessage : 'PAN verification failed. Please try again.')
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
