import { useCallback, useMemo, useState } from 'react'

import { showError, showSuccessMessage } from '@/components/ui'
import { useIsAuthenticated } from '@/queries/auth.query'
import { useExecuteSwap, useScanUserPlan, useVerifyInwardBattery } from '@/queries/swap-manager/battery-swaps.query'
import { useManagerSwapStation } from '@/queries/swap-manager/swap-station.query'
import type { V1UserPlansScanQrResponse } from '@/services/api/codegen/Api'

export type Step = 1 | 2 | 3 | 'success' | 'error'

const extractUserPlanId = (qrData: string): string => {
    if (!qrData) return ''
    try {
        const parsed = JSON.parse(qrData)
        return parsed.userPlanId || ''
    } catch {
        return qrData.trim()
    }
}

const extractBatteryQrId = (qrData: string): string => {
    if (!qrData) return ''
    try {
        const parsed = JSON.parse(qrData)
        return (
            parsed.BatteryIdentificationNumber ||
            parsed.batteryIdentifierNumber ||
            parsed.batteryQrId ||
            parsed.BatteryID ||
            ''
        )
    } catch {
        return qrData.trim()
    }
}

export const useExecuteSwapFlow = () => {
    const [step, setStep] = useState<Step>(1)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [scannedData, setScannedData] = useState<V1UserPlansScanQrResponse | null>(null)
    const [inwardBatteryQrId, setInwardBatteryQrId] = useState<string | null>(null)
    const [scannerActive, setScannerActive] = useState(true)

    const { data: auth } = useIsAuthenticated()
    const managerId = auth?.userId ?? ''
    const { data: managerStation } = useManagerSwapStation({
        variables: { managerId },
        enabled: !!managerId,
    })

    const { mutate: scanPlan, isPending: isScanningPlan } = useScanUserPlan()
    const { mutate: verifyInward, isPending: isVerifyingInward } = useVerifyInwardBattery()
    const { mutate: executeSwap, isPending: isExecutingSwap } = useExecuteSwap()

    const isProcessing = isScanningPlan || isVerifyingInward || isExecutingSwap

    const activateScanner = useCallback(() => {
        setScannerActive(true)
    }, [])

    const handleScanPlan = useCallback(
        (qrData: string) => {
            if (isScanningPlan) return

            const userPlanId = extractUserPlanId(qrData)
            if (!userPlanId) {
                setStep('error')
                setErrorMessage('Invalid QR code. Could not extract plan ID.')
                return
            }

            scanPlan(
                { id: userPlanId },
                {
                    onSuccess: (res) => {
                        if (res.userPlan.status !== 'active') {
                            setStep('error')
                            setErrorMessage(`Plan is not active. Current status: ${res.userPlan.status}`)
                            return
                        }

                        if (!res.booking?.id) {
                            setStep('error')
                            setErrorMessage('No active booking found for this plan.')
                            return
                        }

                        if (res.booking.status !== 'ongoing') {
                            setStep('error')
                            setErrorMessage(`Booking is not ongoing. Current status: ${res.booking.status}`)
                            return
                        }

                        setScannedData(res)
                        setScannerActive(false)
                        setStep(2)
                    },
                    onError: (err: any) => {
                        showError(err)
                        setStep('error')
                        setErrorMessage(err.response?.data?.message || err.message || 'Failed to scan plan')
                    },
                },
            )
        },
        [scanPlan, isScanningPlan],
    )

    const handleScanInward = useCallback(
        (qrData: string) => {
            if (isVerifyingInward || !scannedData?.booking?.id) return
            const batteryQrId = extractBatteryQrId(qrData)
            if (!batteryQrId) {
                setStep('error')
                setErrorMessage('Invalid QR code. Could not extract battery identifier.')
                return
            }

            verifyInward(
                {
                    bookingId: scannedData.booking.id,
                    batteryQrId,
                },
                {
                    onSuccess: (res) => {
                        if (!res.verified) {
                            setStep('error')
                            setErrorMessage(
                                'Battery verification failed. The scanned battery does not match the assigned battery.',
                            )
                            return
                        }

                        setInwardBatteryQrId(batteryQrId)
                        setScannerActive(false)
                        setStep(3)
                    },
                    onError: (err: any) => {
                        showError(err)
                        setStep('error')
                        setErrorMessage(err.response?.data?.message || err.message || 'Failed to verify battery')
                    },
                },
            )
        },
        [verifyInward, scannedData, isVerifyingInward],
    )

    const handleScanOutward = useCallback(
        (qrData: string) => {
            if (isExecutingSwap || !scannedData?.booking?.id) return

            if (!managerStation?.id) {
                setStep('error')
                setErrorMessage('Could not determine your swap station. Please try again.')
                return
            }

            const newBatteryQrId = extractBatteryQrId(qrData)
            if (!newBatteryQrId) {
                setStep('error')
                setErrorMessage('Invalid QR code. Could not extract battery identifier.')
                return
            }

            executeSwap(
                {
                    bookingId: scannedData.booking.id,
                    newBatteryQrId,
                    stationId: managerStation.id,
                },
                {
                    onSuccess: () => {
                        showSuccessMessage('Swap executed successfully!')
                        setStep('success')
                    },
                    onError: (err: any) => {
                        showError(err)
                        setStep('error')
                        setErrorMessage(err.response?.data?.message || err.message || 'Swap execution failed')
                    },
                },
            )
        },
        [executeSwap, scannedData, managerStation, isExecutingSwap],
    )

    const resetFlow = useCallback(() => {
        setStep(1)
        setErrorMessage(null)
        setScannedData(null)
        setInwardBatteryQrId(null)
        setScannerActive(true)
    }, [])

    const loadingMessage = useMemo(() => {
        if (isScanningPlan) return 'Validating Plan...'
        if (isVerifyingInward) return 'Verifying Battery...'
        if (isExecutingSwap) return 'Executing Swap...'
        return ''
    }, [isScanningPlan, isVerifyingInward, isExecutingSwap])

    return {
        step,
        errorMessage,
        scannedData,
        inwardBatteryQrId,
        scannerActive,
        handleScanPlan,
        handleScanInward,
        handleScanOutward,
        activateScanner,
        resetFlow,
        isProcessing,
        loadingMessage,
    }
}
