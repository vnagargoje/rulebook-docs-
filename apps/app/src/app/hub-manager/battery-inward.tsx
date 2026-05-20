import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import { SafeAreaView, Text, View } from '@/components/ui'
import { ConfirmStep, ScanStep, SelectMovementStep } from '@/components/hub-manager/battery-inward'
import { ErrorState, StepIndicator, SuccessState } from '@/components/hub-manager/shared'
import { useBatteryInwardFlow } from '@/hooks/hub-manager/use-battery-inward-flow'
import { useGetMovements, useGetHubStation } from '@/queries/hub-manager'
import { useIsAuthenticated } from '@/queries/auth.query'

import { INWARD_STEP_INDEX, INWARD_STEP_LABELS } from '@/constants/hub-manager.constants'

export default function BatteryInwardScreen() {
    const router = useRouter()

    const { data: auth } = useIsAuthenticated()
    const managerId = auth?.userId ?? ''

    const { data: stationData } = useGetHubStation({
        variables: { managerId },
        enabled: !!managerId,
    })

    const stationId = stationData?.data?.[0]?.id ?? ''

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
    } = useBatteryInwardFlow()

    const { data: movementsData, isLoading: isLoadingMovements } = useGetMovements({
        variables: {
            'filter.status': ['$eq:in_transit'],
            'filter.toStationId': stationId ? [`$eq:${stationId}`] : undefined,
        },
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
                    title='Submission Failed'
                    message={errorMessage ?? 'An unexpected error occurred. Please try again.'}
                    primaryLabel='Try Again'
                    secondaryLabel='Cancel'
                    onPrimary={reset}
                    onSecondary={() => router.back()}
                />
            </SafeAreaView>
        )
    }

    const currentStepIndex = INWARD_STEP_INDEX[step] ?? 0

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
                <Text className='ml-2 text-base font-bold text-neutral-900'>Battery Inward</Text>
            </View>

            {/* Step Indicator */}
            <View className='bg-white px-4 pb-4 pt-2'>
                <StepIndicator
                    steps={[...INWARD_STEP_LABELS]}
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
                <ScanStep
                    selectedMovement={selectedMovement}
                    scannedBatteries={scannedBatteries}
                    onScan={handleScanBattery}
                    onRemove={handleRemoveBattery}
                    onProceedToConfirm={handleProceedToConfirm}
                />
            )}

            {step === 'confirm' && (
                <ConfirmStep
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
