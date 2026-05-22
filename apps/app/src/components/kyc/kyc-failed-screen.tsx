import React from 'react'

import { Button, SafeAreaView, Text, View } from '@/components/ui'
import { StepIndicator } from '@/components/shared/step-indicator'

interface KycFailedScreenProps {
    currentStep: 1 | 2 | 3
    aadhaarDone?: boolean
    panDone?: boolean
    title: string
    attemptCount: number
    buttonLabel: string
    onContinue: () => void
}

const KYC_STEPS = ['Aadhaar', 'PAN', 'License']

export const KycFailedScreen = React.memo(function KycFailedScreen({
    currentStep,
    aadhaarDone,
    panDone,
    title,
    attemptCount,
    buttonLabel,
    onContinue,
}: KycFailedScreenProps) {
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <StepIndicator steps={KYC_STEPS} currentStepIndex={currentStep - 1} />
            <View className='flex-1 items-center justify-center px-6'>
                <Text className='text-center text-xl font-bold text-neutral-900'>Verification Failed</Text>
                <Text className='mt-2 text-center text-sm text-neutral-500'>
                    {title} verification has failed after {attemptCount} attempts. You can continue with the remaining
                    KYC steps.
                </Text>
                <Button
                    label={buttonLabel}
                    onPress={onContinue}
                    className='mt-8 h-13 w-full rounded-2xl bg-primary-600'
                    textClassName='text-base font-semibold text-white'
                />
            </View>
        </SafeAreaView>
    )
})
