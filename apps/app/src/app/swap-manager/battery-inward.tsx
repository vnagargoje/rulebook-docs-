import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import { SafeAreaView, Text, View } from '@/components/ui'
import {
    ConfirmStepInward,
    ScanStepInward,
    SelectMovementStep,
} from '@/components/swap-manager/battery-transport'
import { ErrorState, StepIndicator, SuccessState } from '@/components/hub-manager/shared'
import { SM_INWARD_STEP_INDEX, SM_INWARD_STEP_LABELS } from '@/constants/swap-manager.constants'
import { useSmBatteryInwardFlow } from '@/hooks/swap-manager/use-sm-battery-inward-flow'
import { useGetInTransitMovementsToStation } from '@/queries/swap-manager/battery-transport.query'
import { useManagerSwapStation } from '@/queries/swap-manager/swap-station.query'
import { useAuthStore } from '@/stores/auth.store'

export default function SMBatteryInwardScreen() {
    const router = useRouter()
    const userId = useAuthStore.use.user().id

    const { data: swapStationData } = useManagerSwapStation({
        variables: { managerId: userId ?? '' },
        enabled: !!userId,
    })

    const stationId = swapStationData?.id ?? ''

    const {
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
    } = useSmBatteryInwardFlow()

    const { data: movementsData, isLoading: isLoadingMovements } = useGetInTransitMovementsToStation({
        variables: { toStationId: stationId },
        enabled: !!stationId && step === 'select-movement',
    })

    const movements = movementsData?.data ?? []

    if (step === 'success') {
        return (
            <SafeAreaView
                className='flex-1 bg-white'
                edges={['top']}>
                <SuccessState
                    title='Batteries Received!'
                    message={`${scannedBatteries.length} batteries have been successfully received from the transport vehicle.`}
                    primaryLabel='Done'
                    secondaryLabel='Receive More Batteries'
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
                    title='Receive Failed'
                    message={errorMessage ?? 'An unexpected error occurred. Please try again.'}
                    primaryLabel='Try Again'
                    secondaryLabel='Cancel'
                    onPrimary={reset}
                    onSecondary={() => router.back()}
                />
            </SafeAreaView>
        )
    }

    const currentStepIndex = SM_INWARD_STEP_INDEX[step] ?? 0

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
                <Text className='ml-2 text-base font-bold text-neutral-900'>Receive Batteries from Hub</Text>
            </View>

            {/* Step Indicator */}
            <View className='bg-white px-4 pb-4 pt-2'>
                <StepIndicator
                    steps={[...SM_INWARD_STEP_LABELS]}
                    currentStepIndex={currentStepIndex}
                />
            </View>

            {step === 'select-movement' && (
                <SelectMovementStep
                    movements={movements}
                    isLoading={isLoadingMovements}
                    onSelect={handleSelectMovement}
                />
            )}

            {step === 'scan' && (
                <ScanStepInward
                    selectedMovement={selectedMovement}
                    scannedBatteries={scannedBatteries}
                    onScan={handleScanBattery}
                    onRemove={handleRemoveBattery}
                    onProceedToConfirm={handleProceedToConfirm}
                />
            )}

            {step === 'confirm' && (
                <ConfirmStepInward
                    selectedMovement={selectedMovement}
                    scannedBatteries={scannedBatteries}
                    isPending={isPending}
                    onSubmit={handleSubmit}
                    onBackToScan={handleBackToScan}
                />
            )}
        </SafeAreaView>
    )
}
