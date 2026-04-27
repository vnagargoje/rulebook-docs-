import { useCallback, useState } from 'react'

import { toast } from 'sonner-native'
import { useDispatchBatteries } from '@/queries/hub-manager/battery-transports.query'
import type { V1StationsGetManyStationsResponse, V1VehiclesGetManyVehiclesResponse } from '@/services/api/codegen/Api'

export type OutwardStep = 'select-station' | 'select-vehicle' | 'scan' | 'confirm' | 'submitting' | 'success' | 'error'

type Station = V1StationsGetManyStationsResponse['data'][number]
type Vehicle = V1VehiclesGetManyVehiclesResponse['data'][number]

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

export const useBatteryOutwardFlow = (fromStationId: string) => {
    const [step, setStep] = useState<OutwardStep>('select-station')
    const [selectedStation, setSelectedStation] = useState<Station | null>(null)
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
    const [scannedBatteries, setScannedBatteries] = useState<string[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const { mutate: dispatchBatteries, isPending } = useDispatchBatteries()

    const handleSelectStation = useCallback((station: Station) => {
        setSelectedStation(station)
        setStep('select-vehicle')
    }, [])

    const handleSelectVehicle = useCallback((vehicle: Vehicle) => {
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

    const handleRemoveBattery = useCallback((batteryQrId: string) => {
        setScannedBatteries((prev) => prev.filter((b) => b !== batteryQrId))
    }, [])

    const handleSubmit = useCallback(() => {
        if (!selectedStation || !selectedVehicle || scannedBatteries.length === 0) return

        dispatchBatteries(
            {
                fromStationId,
                toStationId: selectedStation.id,
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
    }, [selectedStation, selectedVehicle, scannedBatteries, fromStationId, dispatchBatteries])

    const reset = useCallback(() => {
        setStep('select-station')
        setSelectedStation(null)
        setSelectedVehicle(null)
        setScannedBatteries([])
        setErrorMessage(null)
    }, [])

    return {
        step,
        selectedStation,
        selectedVehicle,
        scannedBatteries,
        errorMessage,
        isPending,
        handleSelectStation,
        handleSelectVehicle,
        handleScanBattery,
        handleRemoveBattery,
        handleProceedToConfirm,
        handleBackToScan,
        handleSubmit,
        reset,
    }
}
