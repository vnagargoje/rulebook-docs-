import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'

import {
    ErrorState,
    LoadingState,
    ScanInwardBatteryStep,
    ScanOutwardBatteryStep,
    ScanPlanStep,
    StepIndicator,
    SuccessState,
} from '@/components/swap-manager/execute-swap'
import { Button, Pressable, SafeAreaView, Text, View } from '@/components/ui'

import { useExecuteSwapFlow } from '@/hooks/swap-manager/use-execute-swap-flow'

export default function ExecuteSwapScreen() {
    const router = useRouter()
    const {
        step,
        errorMessage,
        scannedData,
        scannerActive,
        handleScanPlan,
        handleScanInward,
        handleScanOutward,
        activateScanner,
        resetFlow,
        isProcessing,
        loadingMessage,
    } = useExecuteSwapFlow()

    if (step === 'success') {
        return <SuccessState onDone={() => router.back()} />
    }

    if (step === 'error') {
        return (
            <ErrorState
                message={errorMessage}
                onRetry={resetFlow}
                onCancel={() => router.back()}
            />
        )
    }

    const renderStepContent = () => {
        if (isProcessing) {
            return <LoadingState message={loadingMessage} />
        }

        if (step === 1) {
            return <ScanPlanStep onScan={handleScanPlan} />
        }

        if (step === 2) {
            if (!scannerActive) {
                return (
                    <View className='flex-1 items-center justify-center p-8'>
                        <View className='h-20 w-20 rounded-full bg-primary-50 items-center justify-center mb-6'>
                            <MaterialCommunityIcons
                                name='check-circle-outline'
                                size={48}
                                color='#2563eb'
                            />
                        </View>
                        <Text className='text-xl font-bold text-neutral-900 text-center'>Plan Verified</Text>
                        <Text className='mt-2 text-neutral-500 text-center leading-relaxed'>
                            Customer plan is valid. Now collect the old battery from the customer and scan its QR code.
                        </Text>
                        <Button
                            label='Scan Inward Battery'
                            onPress={activateScanner}
                            className='mt-8 w-full'
                        />
                    </View>
                )
            }
            return <ScanInwardBatteryStep onScan={handleScanInward} />
        }

        if (step === 3) {
            if (!scannerActive) {
                return (
                    <View className='flex-1 items-center justify-center p-8'>
                        <View className='h-20 w-20 rounded-full bg-primary-50 items-center justify-center mb-6'>
                            <MaterialCommunityIcons
                                name='check-circle-outline'
                                size={48}
                                color='#2563eb'
                            />
                        </View>
                        <Text className='text-xl font-bold text-neutral-900 text-center'>Battery Collected</Text>
                        <Text className='mt-2 text-neutral-500 text-center leading-relaxed'>
                            Old battery verified successfully. Now scan the new charged battery QR code to complete the
                            swap.
                        </Text>
                        <Button
                            label='Scan Outward Battery'
                            onPress={activateScanner}
                            className='mt-8 w-full'
                        />
                    </View>
                )
            }
            return <ScanOutwardBatteryStep onScan={handleScanOutward} />
        }

        return null
    }

    return (
        <SafeAreaView
            className='flex-1 bg-neutral-50'
            edges={['top', 'bottom']}>
            <View className='flex-row items-center px-4 py-3 bg-white'>
                <Pressable
                    onPress={() => router.back()}
                    className='p-2 -ml-2'>
                    <MaterialCommunityIcons
                        name='chevron-left'
                        size={28}
                        color='#171717'
                    />
                </Pressable>
                <Text className='flex-1 ml-2 text-lg font-bold text-neutral-900'>Execute Swap</Text>
                {step !== 1 && (
                    <Pressable
                        onPress={resetFlow}
                        className='p-2'>
                        <MaterialCommunityIcons
                            name='refresh'
                            size={20}
                            color='#737373'
                        />
                    </Pressable>
                )}
            </View>

            <StepIndicator currentStep={typeof step === 'number' ? step : 0} />

            <View className='flex-1'>{renderStepContent()}</View>

            {(step === 2 || step === 3) && scannedData && (
                <View className='bg-white p-6 border-t border-neutral-100'>
                    <View className='flex-row justify-between items-center'>
                        <View>
                            <Text className='text-xs font-bold text-neutral-400 uppercase tracking-wider'>
                                Customer
                            </Text>
                            <Text className='text-base font-bold text-neutral-900'>
                                {scannedData.user?.firstName} {scannedData.user?.lastName}
                            </Text>
                        </View>
                        <View className='items-end'>
                            <Text className='text-xs font-bold text-neutral-400 uppercase tracking-wider'>Plan</Text>
                            <Text className='text-base font-bold text-primary-600'>{scannedData.plan?.name}</Text>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    )
}
