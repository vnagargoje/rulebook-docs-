import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, KeyboardAvoidingView, Platform, TextInput } from 'react-native'

import { Button, SafeAreaView, ScrollView, Text, View, showErrorMessage } from '@/components/ui'
import { FieldWrapper } from '@/components/profile/field-wrapper'
import { SectionCard } from '@/components/profile/section-card'
import {
    KYC_STATUS_QUERY_KEY,
    fetchKycStatus,
    getFirstIncompleteKycRoute,
    useKycStatus,
    usePanVerify,
} from '@/queries/customer/kyc.query'
import { panSchema, type PanFormValues } from '@/schema/kyc/kyc.schema'

export default function PanScreen() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: kycStatus } = useKycStatus()
    const panVerify = usePanVerify()

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PanFormValues>({
        resolver: zodResolver(panSchema),
        mode: 'onChange',
        defaultValues: { pan: '' },
    })

    const onSubmit = handleSubmit(async (values) => {
        Keyboard.dismiss()
        const result = await panVerify.mutateAsync({ pan: values.pan })
        if (result.success) {
            await queryClient.invalidateQueries({ queryKey: [...KYC_STATUS_QUERY_KEY] })
            router.replace('/customer/kyc/license')
        } else {
            const nextStatus = await queryClient.fetchQuery({ queryKey: [...KYC_STATUS_QUERY_KEY], queryFn: fetchKycStatus })
            const nextRoute = getFirstIncompleteKycRoute(nextStatus)
            if (nextRoute !== '/customer/kyc/pan') {
                router.replace(nextRoute as never)
                return
            }
            showErrorMessage(result.message || 'PAN verification failed. Please check the number and try again.')
        }
    })

    const isPanVerified = kycStatus?.pan?.status === 'verified' || kycStatus?.pan?.status === 'approved'
    const isFailedMax = getFirstIncompleteKycRoute(kycStatus) !== '/customer/kyc/pan' && !isPanVerified

    if (isFailedMax) {
        return (
            <SafeAreaView className='flex-1 bg-white'>
                <View className='mx-4 mt-4 flex-row items-center gap-2'>
                    <StepDot done step={1} />
                    <StepLine done />
                    <StepDot active step={2} />
                    <StepLine />
                    <StepDot step={3} />
                </View>
                <View className='flex-1 items-center justify-center px-6'>
                    <Text className='text-center text-xl font-bold text-neutral-900'>Verification Failed</Text>
                    <Text className='mt-2 text-center text-sm text-neutral-500'>
                        PAN verification has failed after {kycStatus?.pan?.attemptCount ?? 0} attempts. You can continue with the remaining KYC steps.
                    </Text>
                    <Button
                        label='Continue to Driving License'
                        onPress={() => router.replace('/customer/kyc/license')}
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
                        <StepDot active step={2} />
                        <StepLine />
                        <StepDot step={3} />
                    </View>

                    <View className='mx-4 mt-5 mb-2'>
                        <Text className='text-lg font-bold text-neutral-900'>Verify your PAN</Text>
                        <Text className='mt-1 text-sm text-neutral-500'>
                            Enter your 10-character PAN card number exactly as it appears on the card.
                        </Text>
                    </View>

                    <SectionCard title='PAN Details'>
                        <Controller
                            control={control}
                            name='pan'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FieldWrapper label='PAN Number' required error={errors.pan?.message} last>
                                    <TextInput
                                        value={value}
                                        onChangeText={(t) => {
                                            const upper = t.toUpperCase().trim().slice(0, 10)
                                            onChange(upper)
                                            setValue('pan', upper)
                                        }}
                                        onBlur={onBlur}
                                        placeholder='ABCDE1234F'
                                        placeholderTextColor='#C4C9D4'
                                        autoCapitalize='characters'
                                        maxLength={10}
                                        style={inputStyle}
                                    />
                                </FieldWrapper>
                            )}
                        />
                    </SectionCard>

                    <View className='mx-4 mt-4'>
                        <Button
                            label='Verify PAN'
                            onPress={onSubmit}
                            loading={panVerify.isPending}
                            disabled={panVerify.isPending}
                            className='h-13 rounded-2xl bg-primary-600'
                            textClassName='text-base font-semibold text-white'
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

function StepDot({ step, active, done }: { step: number; active?: boolean; done?: boolean }) {
    return (
        <View
            className={`h-7 w-7 items-center justify-center rounded-full ${done ? 'bg-emerald-500' : active ? 'bg-primary-600' : 'bg-neutral-200'
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
    letterSpacing: 1.5,
}
