import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { ActivityIndicator, Pressable } from 'react-native'

import { SafeAreaView, Text, View } from '@/components/ui'
import {
    ConfirmStepOutward,
    ScanStepOutward,
    SelectHubStep,
    SelectVehicleStep,
} from '@/components/swap-manager/battery-transport'
import { ErrorState, StepIndicator, SuccessState } from '@/components/hub-manager/shared'
import { SM_OUTWARD_STEP_INDEX, SM_OUTWARD_STEP_LABELS } from '@/constants/swap-manager.constants'
import { useSmBatteryOutwardFlow } from '@/hooks/swap-manager/use-sm-battery-outward-flow'
import { useManagerSwapStation } from '@/queries/swap-manager/swap-station.query'
import {
    useGetHubStations,
    useGetSMTransportVehicles,
} from '@/queries/swap-manager/battery-transport.query'
import { useAuthStore } from '@/stores/auth.store'

export default function SMBatteryOutwardScreen() {
    const router = useRouter()
    const userId = useAuthStore.use.user().id

    const { data: swapStationData, isLoading: isLoadingStation } = useManagerSwapStation({
        variables: { managerId: userId ?? '' },
        enabled: !!userId,
    })

    const fromStationId = swapStationData?.id ?? ''

    const {
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
    } = useSmBatteryOutwardFlow(fromStationId)

    const { data: hubStationsData, isLoading: isLoadingHubs } = useGetHubStations({
        enabled: step === 'select-hub',
    })

    const { data: vehiclesData, isLoading: isLoadingVehicles } = useGetSMTransportVehicles({
        enabled: step === 'select-vehicle',
    })

    const hubStations = hubStationsData?.data ?? []
    const transportVehicles = vehiclesData?.data ?? []

    if (step === 'success') {
        return (
            <SafeAreaView
                className='flex-1 bg-white'
                edges={['top']}>
                <SuccessState
                    title='Batteries Dispatched!'
                    message={`${scannedBatteries.length} batteries have been dispatched to ${selectedHub?.name ?? 'the hub station'}.`}
                    primaryLabel='Done'
                    secondaryLabel='Dispatch More Batteries'
                    onPrimary={() => {
                        reset()
                        router.back()
                    }}
                    onSecondary={reset}
                    iconColor='#D97706'
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

    const currentStepIndex = SM_OUTWARD_STEP_INDEX[step] ?? 0

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
                <Text className='ml-2 text-base font-bold text-neutral-900'>Send Batteries to Hub</Text>
            </View>

            {/* Step Indicator */}
            <View className='bg-white px-4 pb-4 pt-2'>
                <StepIndicator
                    steps={[...SM_OUTWARD_STEP_LABELS]}
                    currentStepIndex={currentStepIndex}
                />
            </View>

            {/* Loading swap station */}
            {isLoadingStation && !fromStationId && (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator
                        size='large'
                        color='#D97706'
                    />
                    <Text className='mt-3 text-sm text-neutral-400'>Loading station...</Text>
                </View>
            )}

            {step === 'select-hub' && !isLoadingStation && (
                <SelectHubStep
                    stations={hubStations}
                    isLoading={isLoadingHubs}
                    onSelect={handleSelectHub}
                />
            )}

            {step === 'select-vehicle' && (
                <SelectVehicleStep
                    vehicles={transportVehicles}
                    selectedHub={selectedHub}
                    isLoading={isLoadingVehicles}
                    onSelect={handleSelectVehicle}
                />
            )}

            {step === 'scan' && (
                <ScanStepOutward
                    selectedHub={selectedHub}
                    selectedVehicle={selectedVehicle}
                    scannedBatteries={scannedBatteries}
                    onScan={handleScanBattery}
                    onRemove={handleRemoveBattery}
                    onProceedToConfirm={handleProceedToConfirm}
                />
            )}

            {step === 'confirm' && (
                <ConfirmStepOutward
                    selectedHub={selectedHub}
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
