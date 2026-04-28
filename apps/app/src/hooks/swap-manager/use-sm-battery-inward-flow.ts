import { useCallback, useState } from 'react'

import { toast } from 'sonner-native'

import { useReceiveBatteries } from '@/queries/hub-manager/battery-transports.query'
import type { SMMovement } from '@/queries/swap-manager/battery-transport.query'

export type SMInwardStep = 'select-movement' | 'scan' | 'confirm' | 'success' | 'error'

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

export const useSmBatteryInwardFlow = () => {
    const [step, setStep] = useState<SMInwardStep>('select-movement')
    const [selectedMovement, setSelectedMovement] = useState<SMMovement | null>(null)
    const [scannedBatteries, setScannedBatteries] = useState<string[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const { mutate: receiveBatteries, isPending } = useReceiveBatteries()

    const handleSelectMovement = useCallback((movement: SMMovement) => {
        setSelectedMovement(movement)
        setScannedBatteries([])
        setStep('scan')
    }, [])

    const handleScanBattery = useCallback(
        (qrData: string) => {
            const batteryQrId = extractBatteryQrId(qrData)
            if (!batteryQrId) {
                toast.error('Invalid QR code', { description: 'Could not read a battery identifier.' })
                return
            }
            if (scannedBatteries.includes(batteryQrId)) {
                toast.error('Already scanned', { description: batteryQrId })
                return
            }
            setScannedBatteries((prev) => [...prev, batteryQrId])
        },
        [scannedBatteries],
    )

    const handleRemoveBattery = useCallback((batteryQrId: string) => {
        setScannedBatteries((prev) => prev.filter((b) => b !== batteryQrId))
    }, [])

    const handleProceedToConfirm = useCallback(() => {
        if (scannedBatteries.length === 0) {
            toast.error('No batteries scanned', { description: 'Please scan at least one battery before continuing.' })
            return
        }
        setStep('confirm')
    }, [scannedBatteries])

    const handleBackToScan = useCallback(() => {
        setStep('scan')
    }, [])

    const handleSubmit = useCallback(() => {
        if (!selectedMovement || scannedBatteries.length === 0) return

        receiveBatteries(
            { movementId: selectedMovement.id, batteryQrIds: scannedBatteries },
            {
                onSuccess: () => {
                    setStep('success')
                },
                onError: (err: any) => {
                    const msg = err.response?.data?.message || err.message || 'Failed to receive batteries'
                    toast.error(msg)
                    setErrorMessage(msg)
                    setStep('error')
                },
            },
        )
    }, [selectedMovement, scannedBatteries, receiveBatteries])

    const reset = useCallback(() => {
        setStep('select-movement')
        setSelectedMovement(null)
        setScannedBatteries([])
        setErrorMessage(null)
    }, [])

    return {
        step,
        selectedMovement,
        scannedBatteries,
        errorMessage,
        isPending,
        handleSelectMovement,
        handleScanBattery,
        handleRemoveBattery,
        handleProceedToConfirm,
        handleBackToScan,
        handleSubmit,
        reset,
    }
}
