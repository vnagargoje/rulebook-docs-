import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'

import { Button, SafeAreaView, Text, View, showErrorMessage, showSuccessMessage } from '@/components/ui'
import {
    KYC_STATUS_QUERY_KEY,
    getFailedKycDocumentIds,
    hasRequestedManualVerification,
    useKycApplyManual,
    useKycStatus,
} from '@/queries/customer/kyc.query'
import colors from '@/components/ui/colors'
import { useQueryClient } from '@tanstack/react-query'

export default function ManualVerificationScreen() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: kycStatus, isLoading } = useKycStatus()
    const applyManual = useKycApplyManual()
    const [isApplying, setIsApplying] = useState(false)
    const [isUnderReview, setIsUnderReview] = useState(false)

    useEffect(() => {
        if (!isUnderReview) return

        const timeoutId = setTimeout(() => {
            router.replace('/customer/kyc/profile')
        }, 2500)

        return () => clearTimeout(timeoutId)
    }, [isUnderReview, router])

    const handleApplyManual = async () => {
        if (!kycStatus || isApplying || isUnderReview) return

        setIsApplying(true)
        try {
            const failedIds = getFailedKycDocumentIds(kycStatus)

            if (failedIds.length === 0) {
                showErrorMessage('No failed documents found to request manual verification.')
                setIsApplying(false)
                return
            }

            for (const id of failedIds) {
                await applyManual.mutateAsync({ id, data: { notes: 'Requested by user from mobile app' } })
            }

            showSuccessMessage('Manual verification requested successfully.')
            await queryClient.invalidateQueries({ queryKey: [...KYC_STATUS_QUERY_KEY] })
            setIsUnderReview(true)
        } catch {
            showErrorMessage('Failed to request manual verification. Please try again.')
        } finally {
            setIsApplying(false)
        }
    }

    if (isLoading || !kycStatus) {
        return (
            <SafeAreaView className='flex-1 items-center justify-center bg-white'>
                <ActivityIndicator size='large' color={colors.primary[600]} />
            </SafeAreaView>
        )
    }

    const requested = isUnderReview || hasRequestedManualVerification(kycStatus)
    const needed = getFailedKycDocumentIds(kycStatus).length > 0

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='flex-1 items-center justify-center px-6'>
                {requested ? (
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
                                onPress={() => router.replace('/customer')}
                                className='mt-8 h-13 w-full rounded-2xl bg-neutral-100'
                                textClassName='text-base font-semibold text-neutral-900'
                            />
                        )}
                    </>
                ) : needed ? (
                    <>
                        <Text className='mb-4 text-center text-2xl font-bold text-neutral-900'>Verification Required</Text>
                        <Text className='text-center text-base text-neutral-600'>
                            Some of your documents failed automatic verification after maximum attempts. You need to request a manual verification from our team.
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
                        <Text className='mb-4 text-center text-2xl font-bold text-neutral-900'>You're Good to Go</Text>
                        <Button
                            label='Continue'
                            onPress={() => router.replace('/customer/kyc/license')}
                            className='mt-8 h-13 w-full rounded-2xl bg-primary-600'
                            textClassName='text-base font-semibold text-white'
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    )
}
