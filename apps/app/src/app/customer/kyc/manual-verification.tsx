import { ActivityIndicator } from 'react-native'

import { Button, SafeAreaView, Text, View } from '@/components/ui'
import colors from '@/components/ui/colors'
import { useManualVerification } from '@/hooks/customer/use-manual-verification'

export default function ManualVerificationScreen() {
    const {
        isLoading,
        kycStatus,
        alreadyRequested,
        needsManualVerification,
        isUnderReview,
        isApplying,
        handleApplyManual,
        handleGoHome,
        handleContinue,
    } = useManualVerification()

    if (isLoading || !kycStatus) {
        return (
            <SafeAreaView className='flex-1 items-center justify-center bg-white'>
                <ActivityIndicator size='large' color={colors.primary[600]} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='flex-1 items-center justify-center px-6'>
                {alreadyRequested ? (
                    <>
                        <Text className='mb-4 text-center text-2xl font-bold text-neutral-900'>Under Review</Text>
                        <Text className='text-center text-base text-neutral-600'>
                            Manual verification request submitted.{'\n'}Our team will review your KYC.
                        </Text>
                        {isUnderReview ? (
                            <ActivityIndicator
                                size='small'
                                color={colors.primary[600]}
                                style={{ marginTop: 32 }}
                            />
                        ) : (
                            <Button
                                label='Go Home'
                                onPress={handleGoHome}
                                className='mt-8 h-13 w-full rounded-2xl bg-neutral-100'
                                textClassName='text-base font-semibold text-neutral-900'
                            />
                        )}
                    </>
                ) : needsManualVerification ? (
                    <>
                        <Text className='mb-4 text-center text-2xl font-bold text-neutral-900'>
                            Verification Required
                        </Text>
                        <Text className='text-center text-base text-neutral-600'>
                            Some of your documents failed automatic verification after maximum attempts. You need to
                            request a manual verification from our team.
                        </Text>
                        <Button
                            label='Request Manual Verification'
                            onPress={handleApplyManual}
                            loading={isApplying}
                            disabled={isApplying}
                            className='mt-8 h-13 w-full rounded-2xl bg-primary-600'
                            textClassName='text-base font-semibold text-white'
                        />
                    </>
                ) : (
                    <>
                        <Text className='mb-4 text-center text-2xl font-bold text-neutral-900'>
                            You're Good to Go
                        </Text>
                        <Button
                            label='Continue'
                            onPress={handleContinue}
                            className='mt-8 h-13 w-full rounded-2xl bg-primary-600'
                            textClassName='text-base font-semibold text-white'
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    )
}
