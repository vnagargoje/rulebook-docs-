import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { ActivityIndicator, Pressable } from 'react-native'

import { SafeAreaView, Text, View } from '@/components/ui'
import { ConfirmStep, ScanStep, SelectStationStep, SelectVehicleStep } from '@/components/hub-manager/battery-outward'
import { ErrorState, StepIndicator, SuccessState } from '@/components/hub-manager/shared'
import { useBatteryOutwardFlow } from '@/hooks/hub-manager/use-battery-outward-flow'
import { useGetHubStation, useGetSwapStations, useGetTransportVehicles } from '@/queries/hub-manager'
import { useAuthStore } from '@/stores/auth.store'

import { OUTWARD_STEP_INDEX, OUTWARD_STEP_LABELS } from '@/constants/hub-manager.constants'

export default function BatteryOutwardScreen() {
    const router = useRouter()
    const userId = useAuthStore.use.user().id

    const { data: hubStationData, isLoading: isLoadingHub } = useGetHubStation({
        variables: { managerId: userId ?? '' },
        enabled: !!userId,
    })

    const fromStationId = hubStationData?.data?.[0]?.id ?? ''

    const {
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
    } = useBatteryOutwardFlow(fromStationId)

    const { data: swapStationsData, isLoading: isLoadingStations } = useGetSwapStations({
        enabled: step === 'select-station',
    })

    const { data: vehiclesData, isLoading: isLoadingVehicles } = useGetTransportVehicles({
        enabled: step === 'select-vehicle',
    })

    const swapStations = swapStationsData?.data ?? []
    const transportVehicles = vehiclesData?.data ?? []

    if (step === 'success') {
        return (
            <SafeAreaView
                className='flex-1 bg-white'
                edges={['top']}>
                <SuccessState
                    title='Batteries Dispatched!'
                    message={`${scannedBatteries.length} charged batteries have been dispatched to ${selectedStation?.name ?? 'the swap station'}.`}
                    primaryLabel='Done'
                    secondaryLabel='Dispatch More Batteries'
                    onPrimary={() => {
                        reset()
                        router.back()
                    }}
                    onSecondary={reset}
                    iconColor='#059669'
                />
            </SafeAreaView>
        )
    }

    if (step === 'error') {
        return (
            <SafeAreaView
                className='flex-1 bg-white'
                edges={['top']}>
                <ErrorState
                    title='Dispatch Failed'
                    message={errorMessage ?? 'An unexpected error occurred. Please try again.'}
                    primaryLabel='Try Again'
                    secondaryLabel='Cancel'
                    onPrimary={reset}
                    onSecondary={() => router.back()}
                />
            </SafeAreaView>
        )
    }

    const currentStepIndex = OUTWARD_STEP_INDEX[step] ?? 0

    return (
        <SafeAreaView
            className='flex-1 bg-neutral-50'
            edges={['top']}>
            {/* Header */}
            <View className='flex-row items-center bg-white px-4 py-3'>
                <Pressable
                    onPress={() => router.back()}
                    className='-ml-2 p-2'>
                    <MaterialCommunityIcons
                        name='arrow-left'
                        size={22}
                        color='#111827'
                    />
                </Pressable>
                <Text className='ml-2 text-base font-bold text-neutral-900'>Battery Outward</Text>
            </View>

            {/* Step Indicator */}
            <View className='bg-white px-4 pb-4 pt-2'>
                <StepIndicator
                    steps={[...OUTWARD_STEP_LABELS]}
                    currentStepIndex={currentStepIndex}
                />
            </View>

            {/* Loading Hub Station */}
            {isLoadingHub && !fromStationId && (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator
                        size='large'
                        color='#2563EB'
                    />
                    <Text className='mt-3 text-sm text-neutral-400'>Loading hub station...</Text>
                </View>
            )}

            {step === 'select-station' && !isLoadingHub && (
                <SelectStationStep
                    stations={swapStations}
                    isLoading={isLoadingStations}
                    onSelect={handleSelectStation}
                />
            )}

            {step === 'select-vehicle' && (
                <SelectVehicleStep
                    vehicles={transportVehicles}
                    selectedStation={selectedStation}
                    isLoading={isLoadingVehicles}
                    onSelect={handleSelectVehicle}
                />
            )}

            {step === 'scan' && (
                <ScanStep
                    selectedStation={selectedStation}
                    selectedVehicle={selectedVehicle}
                    scannedBatteries={scannedBatteries}
                    onScan={handleScanBattery}
                    onRemove={handleRemoveBattery}
                    onProceedToConfirm={handleProceedToConfirm}
                />
            )}

            {step === 'confirm' && (
                <ConfirmStep
                    selectedStation={selectedStation}
                    selectedVehicle={selectedVehicle}
                    scannedBatteries={scannedBatteries}
                    isPending={isPending}
                    onSubmit={handleSubmit}
                    onBackToScan={handleBackToScan}
                />
            )}
        </SafeAreaView>
    )
}
