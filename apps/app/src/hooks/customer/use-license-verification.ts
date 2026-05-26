import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import { showErrorMessage } from '@/components/ui'
import { useKycFlow } from '@/hooks/customer/use-kyc-flow'
import { useLicenseGetResult, useLicenseInitiate } from '@/queries/customer/kyc.query'
import { licenseSchema, type LicenseFormValues } from '@/schema/kyc/kyc.schema'
import type { LicenseInitiateResponse } from '@/services/api/codegen/Api'

type Phase = 'form' | 'polling'

const CURRENT_ROUTE = '/customer/kyc/license'

export function useLicenseVerification() {
    const { licenseState, refreshAndNavigate, navigateToNext } = useKycFlow()

    const [phase, setPhase] = useState<Phase>('form')
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const isSubmittingRef = useRef(false)

    const licenseInitiate = useLicenseInitiate()
    const licenseGetResult = useLicenseGetResult()

    const formMethods = useForm<LicenseFormValues>({
        resolver: zodResolver(licenseSchema),
        mode: 'onChange',
        defaultValues: { dlNumber: '', dateOfBirth: '' },
    })

    // Clean up polling interval on unmount
    useEffect(() => {
        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current)
                pollingRef.current = null
            }
        }
    }, [])

    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current)
            pollingRef.current = null
        }
    }, [])

    const startPolling = useCallback(
        (reqId: string) => {
            setPhase('polling')
            
            // Prevent overlapping polling requests
            let isPollingActive = false

            pollingRef.current = setInterval(async () => {
                if (isPollingActive) return
                isPollingActive = true

                try {
                    const result = await licenseGetResult.mutateAsync({ requestId: reqId })

                    if (result.success) {
                        stopPolling()
                        await refreshAndNavigate(CURRENT_ROUTE)
                    } else if (result.message) {
                        stopPolling()
                        setPhase('form')
                        const navigated = await refreshAndNavigate(CURRENT_ROUTE)
                        if (!navigated) {
                            showErrorMessage(result.message || 'License verification failed. Please try again.')
                        }
                    }
                } catch {
                    stopPolling()
                    setPhase('form')
                    const navigated = await refreshAndNavigate(CURRENT_ROUTE)
                    if (!navigated) {
                        showErrorMessage('Verification failed. Please try again.')
                    }
                } finally {
                    isPollingActive = false
                }
            }, 2000)
        },
        [licenseGetResult, refreshAndNavigate, stopPolling],
    )

    const handleSubmit = formMethods.handleSubmit(async (values) => {
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true

        try {
            Keyboard.dismiss()

            const result = await licenseInitiate.mutateAsync({
                dlNumber: values.dlNumber,
                dateOfBirth: values.dateOfBirth,
            })

            if (!result.requestId) {
                const navigated = await refreshAndNavigate(CURRENT_ROUTE)
                if (!navigated) {
                    const failureMessage = (result as Partial<LicenseInitiateResponse & { message: string }>).message
                    showErrorMessage(
                        failureMessage || 'Failed to initiate DL verification. Check your DL number and date of birth.',
                    )
                }
                return
            }

            startPolling(result.requestId)
        } catch {
            const navigated = await refreshAndNavigate(CURRENT_ROUTE)
            if (!navigated) {
                showErrorMessage('Failed to initiate DL verification. Please try again.')
            }
        } finally {
            isSubmittingRef.current = false
        }
    })

    const handleContinue = useCallback(async () => {
        await refreshAndNavigate(CURRENT_ROUTE)
    }, [refreshAndNavigate])

    const isSubmitting = licenseInitiate.isPending

    return {
        phase,
        licenseState,
        formMethods,
        handleSubmit,
        handleContinue,
        isSubmitting,
    }
}
