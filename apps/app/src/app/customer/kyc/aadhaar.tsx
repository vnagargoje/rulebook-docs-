import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, TextInput } from 'react-native'
import { OtpInput } from 'react-native-otp-entry'
import type { OtpInputRef } from 'react-native-otp-entry'

import { Button, SafeAreaView, ScrollView, Text, View, showErrorMessage } from '@/components/ui'
import { FieldWrapper } from '@/components/profile/field-wrapper'
import { SectionCard } from '@/components/profile/section-card'
import {
    KYC_STATUS_QUERY_KEY,
    fetchKycStatus,
    getFirstIncompleteKycRoute,
    useAadhaarConnect,
    useAadhaarGenerateOtp,
    useAadhaarReloadCaptcha,
    useAadhaarVerifyOtp,
    useKycStatus,
} from '@/queries/customer/kyc.query'
import { MY_PROFILE_QUERY_KEY } from '@/queries/profile'
import { aadhaarFormSchema, type AadhaarFormValues } from '@/schema/kyc/kyc.schema'
import colors from '@/components/ui/colors'

type Phase = 'form' | 'otp'

export default function AadhaarScreen() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: kycStatus } = useKycStatus()

    const [phase, setPhase] = useState<Phase>('form')
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [captchaBase64, setCaptchaBase64] = useState<string | null>(null)
    const [aadhaarNumber, setAadhaarNumberState] = useState<string>('')
    const [otp, setOtp] = useState<string>('')
    const otpInputRef = useRef<OtpInputRef>(null)

    const connect = useAadhaarConnect()
    const reloadCaptcha = useAadhaarReloadCaptcha()
    const generateOtp = useAadhaarGenerateOtp()
    const verifyOtp = useAadhaarVerifyOtp()

    const formMethods = useForm<AadhaarFormValues>({
        resolver: zodResolver(aadhaarFormSchema),
        mode: 'onBlur',
        defaultValues: { aadhaarNumber: '', captcha: '' },
    })

    const startSession = useCallback(async () => {
        try {
            const data = await connect.mutateAsync()
            setSessionId(data.sessionId)
            setCaptchaBase64(data.captcha)
        } catch {
            // error shown via onError in hook
        }
    }, [connect])

    useEffect(() => {
        startSession()
    }, [])

    const handleReloadCaptcha = useCallback(async () => {
        if (!sessionId) return
        try {
            const data = await reloadCaptcha.mutateAsync({ sessionId })
            setCaptchaBase64(data.captcha)
            formMethods.setValue('captcha', '')
        } catch {
            // handled
        }
    }, [sessionId, reloadCaptcha, formMethods])

    const handleFormSubmit = formMethods.handleSubmit(async (values) => {
        if (!sessionId) return
        Keyboard.dismiss()
        setAadhaarNumberState(values.aadhaarNumber)

        const result = await generateOtp.mutateAsync({
            sessionId,
            captcha: values.captcha,
            aadhaarNumber: values.aadhaarNumber,
        })

        if (result.success) {
            setOtp('')
            setPhase('otp')
        } else {
            const nextStatus = await queryClient.fetchQuery({ queryKey: [...KYC_STATUS_QUERY_KEY], queryFn: fetchKycStatus })
            const nextRoute = getFirstIncompleteKycRoute(nextStatus)
            if (nextRoute !== '/customer/kyc/aadhaar') {
                router.replace(nextRoute as never)
                return
            }
            showErrorMessage(result.message || 'Failed to send OTP. Please try again.')
            await handleReloadCaptcha()
        }
    })

    const handleOtpSubmit = useCallback(async () => {
        if (!sessionId) return
        if (otp.length < 6) {
            showErrorMessage('Please enter the 6-digit OTP.')
            return
        }
        Keyboard.dismiss()

        const result = await verifyOtp.mutateAsync({
            sessionId,
            otp,
            aadhaarNumber,
        })

        if (result.success) {
            await queryClient.invalidateQueries({ queryKey: [...KYC_STATUS_QUERY_KEY] })
            await queryClient.invalidateQueries({ queryKey: [...MY_PROFILE_QUERY_KEY] })
            router.replace('/customer/kyc/pan')
        } else {
            const nextStatus = await queryClient.fetchQuery({ queryKey: [...KYC_STATUS_QUERY_KEY], queryFn: fetchKycStatus })
            const nextRoute = getFirstIncompleteKycRoute(nextStatus)
            if (nextRoute !== '/customer/kyc/aadhaar') {
                router.replace(nextRoute as never)
                return
            }
            showErrorMessage(result.message || 'OTP verification failed. Please try again.')
            setOtp('')
            otpInputRef.current?.clear()
            setPhase('form')
            await handleReloadCaptcha()
        }
    }, [sessionId, otp, aadhaarNumber, verifyOtp, queryClient, router, handleReloadCaptcha])

    const isConnecting = connect.isPending && !sessionId

    const isAadhaarVerified = kycStatus?.aadhaar?.status === 'verified' || kycStatus?.aadhaar?.status === 'approved'
    const isFailedMax = getFirstIncompleteKycRoute(kycStatus) !== '/customer/kyc/aadhaar' && !isAadhaarVerified

    if (isFailedMax) {
        return (
            <SafeAreaView className='flex-1 bg-white'>
                <View className='mx-4 mt-4 flex-row items-center gap-2'>
                    <StepDot active step={1} />
                    <StepLine />
                    <StepDot step={2} />
                    <StepLine />
                    <StepDot step={3} />
                </View>
                <View className='flex-1 items-center justify-center px-6'>
                    <Text className='text-center text-xl font-bold text-neutral-900'>Verification Failed</Text>
                    <Text className='mt-2 text-center text-sm text-neutral-500'>
                        Aadhaar verification has failed after {kycStatus?.aadhaar?.attemptCount ?? 0} attempts. You can continue with the remaining KYC steps.
                    </Text>
                    <Button
                        label='Continue to PAN'
                        onPress={() => router.replace('/customer/kyc/pan')}
                        className='mt-8 h-13 w-full rounded-2xl bg-primary-600'
                        textClassName='text-base font-semibold text-white'
                    />
                </View>
            </SafeAreaView>
        )
    }

    if (isConnecting) {
        return (
            <SafeAreaView className='flex-1 items-center justify-center bg-white'>
                <ActivityIndicator size='large' color={colors.primary[600]} />
                <Text className='mt-4 text-sm text-neutral-500'>Connecting to verification service…</Text>
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
                    <View className='mx-4 mt-4 flex-row items-center gap-2'>
                        <StepDot active step={1} />
                        <StepLine />
                        <StepDot step={2} />
                        <StepLine />
                        <StepDot step={3} />
                    </View>

                    <View className='mx-4 mt-5 mb-2'>
                        <Text className='text-lg font-bold text-neutral-900'>
                            {phase === 'form' ? 'Verify your Aadhaar' : 'Enter OTP'}
                        </Text>
                        <Text className='mt-1 text-sm text-neutral-500'>
                            {phase === 'form'
                                ? 'Enter your 12-digit Aadhaar number and the captcha below.'
                                : 'A 6-digit OTP has been sent to your Aadhaar-linked mobile number.'}
                        </Text>
                    </View>

                    {phase === 'form' ? (
                        <SectionCard title='Aadhaar Details'>
                            <Controller
                                control={formMethods.control}
                                name='aadhaarNumber'
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FieldWrapper
                                        label='Aadhaar Number'
                                        required
                                        error={formMethods.formState.errors.aadhaarNumber?.message}>
                                        <TextInput
                                            value={value}
                                            onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 12))}
                                            onBlur={onBlur}
                                            placeholder='123456789012'
                                            placeholderTextColor='#C4C9D4'
                                            keyboardType='number-pad'
                                            maxLength={12}
                                            style={inputStyle}
                                        />
                                    </FieldWrapper>
                                )}
                            />

                            <View className='mb-4'>
                                <Text className='mb-1.5 text-[13px] font-semibold text-neutral-700'>
                                    Captcha <Text className='text-[11px] font-bold text-red-500'>*</Text>
                                </Text>
                                <View className='flex-row items-center gap-3'>
                                    {captchaBase64 ? (
                                        <Image
                                            source={{ uri: `data:image/png;base64,${captchaBase64}` }}
                                            style={{
                                                width: 160,
                                                height: 52,
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                borderColor: '#E5E7EB',
                                            }}
                                            resizeMode='cover'
                                        />
                                    ) : (
                                        <View
                                            className='items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50'
                                            style={{ width: 160, height: 52 }}>
                                            <ActivityIndicator size='small' color={colors.primary[600]} />
                                        </View>
                                    )}
                                    <Pressable
                                        onPress={handleReloadCaptcha}
                                        disabled={reloadCaptcha.isPending}
                                        className='flex-row items-center gap-1 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2'>
                                        {reloadCaptcha.isPending ? (
                                            <ActivityIndicator size='small' color={colors.primary[600]} />
                                        ) : (
                                            <Text className='text-xs font-semibold text-primary-600'>↻ Reload</Text>
                                        )}
                                    </Pressable>
                                </View>
                            </View>

                            <Controller
                                control={formMethods.control}
                                name='captcha'
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FieldWrapper
                                        label='Enter Captcha'
                                        required
                                        error={formMethods.formState.errors.captcha?.message}
                                        last>
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            placeholder='Type the captcha text'
                                            placeholderTextColor='#C4C9D4'
                                            autoCapitalize='none'
                                            style={inputStyle}
                                        />
                                    </FieldWrapper>
                                )}
                            />
                        </SectionCard>
                    ) : (
                        <View className='mx-4 mt-4 items-center'>
                            <OtpInput
                                ref={otpInputRef}
                                numberOfDigits={6}
                                autoFocus
                                hideStick
                                placeholder='*'
                                type='numeric'
                                theme={{
                                    containerStyle: {
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        gap: 8,
                                    },
                                    pinCodeContainerStyle: {
                                        borderColor: colors.primary[600],
                                        borderWidth: 2,
                                        borderRadius: 12,
                                    },
                                    pinCodeTextStyle: {
                                        fontSize: 24,
                                    },
                                }}
                                onTextChange={(text) => setOtp(text)}
                            />
                            <Pressable
                                onPress={() => {
                                    setOtp('')
                                    otpInputRef.current?.clear()
                                    setPhase('form')
                                    handleReloadCaptcha()
                                }}
                                className='mt-5'>
                                <Text className='text-center text-xs font-medium text-primary-600'>
                                    ← Back to Aadhaar form
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    <View className='mx-4 mt-6'>
                        <Button
                            label={phase === 'form' ? 'Send OTP' : 'Verify OTP'}
                            onPress={phase === 'form' ? handleFormSubmit : handleOtpSubmit}
                            loading={generateOtp.isPending || verifyOtp.isPending}
                            disabled={
                                !sessionId ||
                                generateOtp.isPending ||
                                verifyOtp.isPending ||
                                (phase === 'otp' && otp.length < 6)
                            }
                            className='h-13 rounded-2xl bg-primary-600'
                            textClassName='text-base font-semibold text-white'
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

function StepDot({ step, active }: { step: number; active?: boolean }) {
    return (
        <View
            className={`h-7 w-7 items-center justify-center rounded-full ${active ? 'bg-primary-600' : 'bg-neutral-200'}`}>
            <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-neutral-500'}`}>{step}</Text>
        </View>
    )
}

function StepLine() {
    return <View className='h-0.5 flex-1 bg-neutral-200' />
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
