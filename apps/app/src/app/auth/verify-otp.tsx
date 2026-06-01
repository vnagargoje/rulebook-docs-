import { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { OtpInput } from 'react-native-otp-entry'
import type { OtpInputRef } from 'react-native-otp-entry'

import { assets } from '@/assets'
import { Paragraph, SubHeading, Text, View, SafeAreaView, Image } from '@/components/ui'
import colors from '@/components/ui/colors'
import { showErrorMessage } from '@/components/ui'
import { isVerifiedOtpResponse } from '@/components/auth/auth.utils'
import { useIsAuthenticated, useVerifyOtp } from '@/queries/auth.query'
import { getFirstIncompleteKycRoute, isKycComplete } from '@/queries/customer/kyc.query'
import { useAuthStore } from '@/stores/auth.store'
import { client } from '@/lib/api/client'
import { useOtpTimer } from '@/hooks/use-otp-timer'

export default function VerifyOtpPage() {
    const router = useRouter()
    const [otp, setOtp] = useState<string>()
    const otpInputRef = useRef<OtpInputRef>(null)
    const searchParams = useLocalSearchParams<{ mobilenumber?: string; redirect?: string; planId?: string }>()
    const mobilenumber = String(searchParams.mobilenumber ?? '')
    const redirect = searchParams.redirect ? String(searchParams.redirect) : ''
    const planId = searchParams.planId ? String(searchParams.planId) : ''
    const verifyOtp = useVerifyOtp()
    const { refetch } = useIsAuthenticated()
    const { timeLeft, canResend, handleResend, isResending } = useOtpTimer(60, mobilenumber)

    const handleOtpFilled = useCallback((text: string) => {
        setOtp(text)
        Keyboard.dismiss()
    }, [])

    const handleOtpChange = useCallback((text: string) => {
        if (text.length < 4) {
            setOtp(undefined)
        }
    }, [])

    const handleSubmit = useCallback(async () => {
        if (!mobilenumber) {
            showErrorMessage('Phone number is missing. Please request a new OTP.')
            router.replace('/auth/sign-in')
            return
        }

        if (!otp || otp.length < 4) {
            showErrorMessage('Please enter a valid 4-digit OTP.')
            return
        }

        verifyOtp.mutateAsync(
            { phoneNumber: mobilenumber, otp },
            {
                async onSuccess(data) {
                    if (!isVerifiedOtpResponse(data)) {
                        showErrorMessage('Invalid OTP. Please try again.')
                        otpInputRef.current?.clear()
                        setOtp(undefined)
                        return
                    }

                    await refetch()

                    const userRole = useAuthStore.getState().user.role

                    if (userRole && userRole !== 'customer') {
                        router.replace('/')
                        return
                    }

                    if (userRole === 'customer') {
                        const kycResponse = await client.v1.kycGetStatus()
                        if (!isKycComplete(kycResponse.data)) {
                            router.replace(getFirstIncompleteKycRoute(kycResponse.data) as never)
                            return
                        }
                    }

                    if (redirect) {
                        const params = new URLSearchParams()

                        if (planId && redirect === '/customer/confirm-booking') {
                            params.set('planId', planId)
                        }

                        const nextRoute = params.toString() ? `${redirect}?${params.toString()}` : redirect
                        router.replace(nextRoute as any)
                        return
                    }

                    router.replace('/')
                },
            },
        )
    }, [mobilenumber, otp, planId, redirect, refetch, router, verifyOtp])

    const isDisabled = !otp || otp.length < 4 || verifyOtp.isPending

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={10}>
            <SafeAreaView className='flex h-full bg-white'>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                    }}
                    className='pt-4'
                    keyboardShouldPersistTaps='handled'>
                    <View className='w-full items-center py-6'>
                        <Image
                            className='h-54 w-54'
                            resizeMode='contain'
                            contentFit='contain'
                            source={assets.Brand.Logo}
                        />

                        <SubHeading
                            text='Verification code'
                            className='mb-4 text-center'
                        />
                        <Paragraph
                            text='We have sent you a 4-digit verification code to your mobile number'
                            className='mb-6 text-center'
                        />

                        <OtpInput
                            ref={otpInputRef}
                            numberOfDigits={4}
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
                                    fontSize: 28,
                                },
                            }}
                            onFilled={handleOtpFilled}
                            onTextChange={handleOtpChange}
                        />

                        <View className='mt-4 flex-col items-center gap-3'>
                            <View className='flex-row items-center'>
                                <Paragraph
                                    text={canResend ? "Didn't receive code? " : `Resend code in 00:${timeLeft.toString().padStart(2, '0')} `}
                                    className='leading-5 text-neutral-600'
                                />
                                {canResend && (
                                    <Pressable onPress={handleResend} disabled={isResending}>
                                        <Paragraph
                                            text={isResending ? 'Resending...' : 'Resend OTP'}
                                            className={`font-medium underline ${isResending ? 'text-neutral-400' : 'text-primary-600'}`}
                                        />
                                    </Pressable>
                                )}
                            </View>

                            <View className='flex-row items-center'>
                                <Paragraph
                                    text='Entered wrong number? '
                                    className='leading-5'
                                />
                                <Pressable onPress={() => router.back()}>
                                    <Paragraph
                                        text='Change number'
                                        className='font-medium text-primary-600 underline'
                                    />
                                </Pressable>
                            </View>
                        </View>

                        <View className='mt-8 w-full pb-5'>
                            <Pressable
                                className={`w-full items-center justify-center rounded-xl py-4 ${isDisabled ? 'bg-neutral-200' : 'bg-primary-600 active:bg-primary-700'}`}
                                disabled={isDisabled}
                                onPress={handleSubmit}>
                                {verifyOtp.isPending ? (
                                    <ActivityIndicator color='#ffffff' />
                                ) : (
                                    <Text className={`text-base font-semibold ${isDisabled ? 'text-neutral-400' : 'text-white'}`}>Verify</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}
