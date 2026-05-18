import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, TextInput } from 'react-native'

import { Button, SafeAreaView, ScrollView, Text, View, showErrorMessage } from '@/components/ui'
import { DobInputs } from '@/components/profile/dob-inputs'
import { FieldWrapper } from '@/components/profile/field-wrapper'
import { SectionCard } from '@/components/profile/section-card'
import {
    KYC_STATUS_QUERY_KEY,
    fetchKycStatus,
    useLicenseGetResult,
    useLicenseInitiate,
    useKycStatus,
    getFirstIncompleteKycRoute,
} from '@/queries/customer/kyc.query'
import { licenseSchema, type LicenseFormValues } from '@/schema/kyc/kyc.schema'
import type { LicenseInitiateResponse } from '@/services/api/codegen/Api'
import colors from '@/components/ui/colors'

type Phase = 'form' | 'polling'

export default function LicenseScreen() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: kycStatus } = useKycStatus()

    const [phase, setPhase] = useState<Phase>('form')
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const licenseInitiate = useLicenseInitiate()
    const licenseGetResult = useLicenseGetResult()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LicenseFormValues>({
        resolver: zodResolver(licenseSchema),
        mode: 'onChange',
        defaultValues: { dlNumber: '', dateOfBirth: '' },
    })

    const startPolling = useCallback(
        (reqId: string) => {
            setPhase('polling')
            pollingRef.current = setInterval(async () => {
                try {
                    const result = await licenseGetResult.mutateAsync({ requestId: reqId })
                    if (result.success) {
                        clearInterval(pollingRef.current!)
                        pollingRef.current = null
                        const newStatus = await queryClient.fetchQuery({
                            queryKey: [...KYC_STATUS_QUERY_KEY],
                            queryFn: fetchKycStatus,
                        })
                        router.replace(getFirstIncompleteKycRoute(newStatus) as never)
                    } else if (result.message) {
                        clearInterval(pollingRef.current!)
                        pollingRef.current = null
                        setPhase('form')
                        const nextStatus = await queryClient.fetchQuery({
                            queryKey: [...KYC_STATUS_QUERY_KEY],
                            queryFn: fetchKycStatus,
                        })
                        if (getFirstIncompleteKycRoute(nextStatus) !== '/customer/kyc/license') {
                            router.replace(getFirstIncompleteKycRoute(nextStatus) as never)
                            return
                        }
                        showErrorMessage(result.message || 'License verification failed. Please try again.')
                    }
                } catch {
                    clearInterval(pollingRef.current!)
                    pollingRef.current = null
                    setPhase('form')
                    await queryClient.invalidateQueries({ queryKey: [...KYC_STATUS_QUERY_KEY] })
                    showErrorMessage('Verification failed. Please try again.')
                }
            }, 2000)
        },
        [licenseGetResult, queryClient, router],
    )

    const onSubmit = handleSubmit(async (values) => {
        Keyboard.dismiss()
        const result = await licenseInitiate.mutateAsync({
            dlNumber: values.dlNumber,
            dateOfBirth: values.dateOfBirth,
        })
        if (!result.requestId) {
            const nextStatus = await queryClient.fetchQuery({ queryKey: [...KYC_STATUS_QUERY_KEY], queryFn: fetchKycStatus })
            if (getFirstIncompleteKycRoute(nextStatus) !== '/customer/kyc/license') {
                router.replace(getFirstIncompleteKycRoute(nextStatus) as never)
                return
            }
            const failureMessage = (result as Partial<LicenseInitiateResponse & { message: string }>).message
            showErrorMessage(failureMessage || 'Failed to initiate DL verification. Check your DL number and date of birth.')
            return
        }

        await queryClient.invalidateQueries({ queryKey: [...KYC_STATUS_QUERY_KEY] })
        startPolling(result.requestId)
    })

    const isLicenseVerified = kycStatus?.license?.status === 'verified' || kycStatus?.license?.status === 'approved'
    const isFailedMax = getFirstIncompleteKycRoute(kycStatus) !== '/customer/kyc/license' && !isLicenseVerified

    if (isFailedMax) {
        return (
            <SafeAreaView className='flex-1 bg-white'>
                <View className='mx-4 mt-4 flex-row items-center gap-2'>
                    <StepDot done step={1} />
                    <StepLine done />
                    <StepDot done step={2} />
                    <StepLine done />
                    <StepDot active step={3} />
                </View>
                <View className='flex-1 items-center justify-center px-6'>
                    <Text className='text-center text-xl font-bold text-neutral-900'>Verification Failed</Text>
                    <Text className='mt-2 text-center text-sm text-neutral-500'>
                        Driving License verification has failed after {kycStatus?.license?.attemptCount ?? 0} attempts. You can continue.
                    </Text>
                    <Button
                        label='Continue'
                        onPress={() => router.replace(getFirstIncompleteKycRoute(kycStatus) as never)}
                        className='mt-8 h-13 w-full rounded-2xl bg-primary-600'
                        textClassName='text-base font-semibold text-white'
                    />
                </View>
            </SafeAreaView>
        )
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}>
            <SafeAreaView edges={['bottom']} className='flex-1 bg-white'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Step indicator */}
                    <View className='mx-4 mt-4 flex-row items-center gap-2'>
                        <StepDot done step={1} />
                        <StepLine done />
                        <StepDot done step={2} />
                        <StepLine done />
                        <StepDot active step={3} />
                    </View>

                    <View className='mx-4 mt-5 mb-2'>
                        <Text className='text-lg font-bold text-neutral-900'>Verify your Driving License</Text>
                        <Text className='mt-1 text-sm text-neutral-500'>
                            Enter your DL number and date of birth as it appears on your license.
                        </Text>
                    </View>

                    {phase === 'polling' ? (
                        <View className='mx-4 mt-8 items-center gap-4 rounded-3xl border border-primary-100 bg-primary-50 p-8'>
                            <ActivityIndicator size='large' color={colors.primary[600]} />
                            <Text className='text-center text-sm font-semibold text-primary-700'>
                                Verifying your license…
                            </Text>
                            <Text className='text-center text-xs text-primary-500'>
                                This may take a few seconds. Please wait.
                            </Text>
                        </View>
                    ) : (
                        <SectionCard title='License Details'>
                            <Controller
                                control={control}
                                name='dlNumber'
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FieldWrapper label='DL Number' required error={errors.dlNumber?.message}>
                                        <TextInput
                                            value={value}
                                            onChangeText={(t) => onChange(t.toUpperCase().trim())}
                                            onBlur={onBlur}
                                            placeholder='KA0120191234567'
                                            placeholderTextColor='#C4C9D4'
                                            autoCapitalize='characters'
                                            style={inputStyle}
                                        />
                                    </FieldWrapper>
                                )}
                            />

                            <Controller
                                control={control}
                                name='dateOfBirth'
                                render={({ field: { onChange, value } }) => (
                                    <FieldWrapper
                                        label='Date of Birth'
                                        required
                                        error={errors.dateOfBirth?.message}
                                        last>
                                        <DobInputs value={value} onChange={onChange} />
                                    </FieldWrapper>
                                )}
                            />
                        </SectionCard>
                    )}

                    {phase === 'form' && (
                        <View className='mx-4 mt-4'>
                            <Button
                                label='Verify License'
                                onPress={onSubmit}
                                loading={licenseInitiate.isPending}
                                disabled={licenseInitiate.isPending}
                                className='h-13 rounded-2xl bg-primary-600'
                                textClassName='text-base font-semibold text-white'
                            />
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

function StepDot({ step, active, done }: { step: number; active?: boolean; done?: boolean }) {
    return (
        <View
            className={`h-7 w-7 items-center justify-center rounded-full ${
                done ? 'bg-emerald-500' : active ? 'bg-primary-600' : 'bg-neutral-200'
            }`}>
            {done ? (
                <Text className='text-xs font-bold text-white'>✓</Text>
            ) : (
                <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-neutral-500'}`}>{step}</Text>
            )}
        </View>
    )
}

function StepLine({ done }: { done?: boolean }) {
    return <View className={`h-0.5 flex-1 ${done ? 'bg-emerald-400' : 'bg-neutral-200'}`} />
}

const inputStyle = {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111827',
}
