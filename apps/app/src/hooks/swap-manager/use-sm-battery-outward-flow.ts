import { useCallback, useState } from 'react'

import { toast } from 'sonner-native'

import { useDispatchBatteries } from '@/queries/hub-manager/battery-transports.query'
import type { SMHubStation, SMTransportVehicle } from '@/queries/swap-manager/battery-transport.query'

export type SMOutwardStep = 'select-hub' | 'select-vehicle' | 'scan' | 'confirm' | 'success' | 'error'

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

export const useSmBatteryOutwardFlow = (fromStationId: string) => {
    const [step, setStep] = useState<SMOutwardStep>('select-hub')
    const [selectedHub, setSelectedHub] = useState<SMHubStation | null>(null)
    const [selectedVehicle, setSelectedVehicle] = useState<SMTransportVehicle | null>(null)
    const [scannedBatteries, setScannedBatteries] = useState<string[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const { mutate: dispatchBatteries, isPending } = useDispatchBatteries()

    const handleSelectHub = useCallback((hub: SMHubStation) => {
        setSelectedHub(hub)
        setStep('select-vehicle')
    }, [])

    const handleSelectVehicle = useCallback((vehicle: SMTransportVehicle) => {
        setSelectedVehicle(vehicle)
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
        if (!selectedHub || !selectedVehicle || scannedBatteries.length === 0) return

        dispatchBatteries(
            {
                fromStationId,
                toStationId: selectedHub.id,
                vehicleId: selectedVehicle.id,
                batteryQrIds: scannedBatteries,
            },
            {
                onSuccess: () => {
                    setStep('success')
                },
                onError: (err: any) => {
                    const msg = err.response?.data?.message || err.message || 'Failed to dispatch batteries'
                    toast.error(msg)
                    setErrorMessage(msg)
                    setStep('error')
                },
            },
        )
    }, [selectedHub, selectedVehicle, scannedBatteries, fromStationId, dispatchBatteries])

    const reset = useCallback(() => {
        setStep('select-hub')
        setSelectedHub(null)
        setSelectedVehicle(null)
        setScannedBatteries([])
        setErrorMessage(null)
    }, [])

    return {
        step,
        selectedHub,
        selectedVehicle,
        scannedBatteries,
        errorMessage,
        isPending,
        handleSelectHub,
        handleSelectVehicle,
        handleScanBattery,
        handleRemoveBattery,
        handleProceedToConfirm,
        handleBackToScan,
        handleSubmit,
        reset,
    }
}
