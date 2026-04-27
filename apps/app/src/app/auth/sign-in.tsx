import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    TextInput,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { assets } from '@/assets'
import { Paragraph, SubHeading, Text, View } from '@/components/ui'
import colors from '@/components/ui/colors'
import { normalizeMobileNumber } from '@/components/auth/auth.utils'
import { useSendOtp } from '@/queries/auth.query'

export default function SignInPage() {
    const router = useRouter()
    const { redirect, planId } = useLocalSearchParams<{ redirect?: string; planId?: string }>()
    const [mobilenumber, setMobilenumber] = useState('')
    const sendOtp = useSendOtp()

    const fullMobileNumber = useMemo(() => `91${mobilenumber}`, [mobilenumber])

    useEffect(() => {
        if (mobilenumber.length === 10) {
            Keyboard.dismiss()
        }
    }, [mobilenumber])

    const handleMobileNumberChange = useCallback((text: string) => {
        const numericText = text.replace(/[^0-9]/g, '').slice(0, 10)
        setMobilenumber(numericText)
    }, [])

    const handleSubmit = useCallback(async () => {
        const normalized = normalizeMobileNumber(fullMobileNumber)
        const response = await sendOtp.mutateAsync(normalized)
        const query = new URLSearchParams({ mobilenumber: response.mobilenumber ?? normalized })

        if (redirect) {
            query.set('redirect', String(redirect))
        }

        if (planId) {
            query.set('planId', String(planId))
        }

        router.push(
            `/auth/verify-otp?${query.toString()}`,
        )
    }, [fullMobileNumber, planId, redirect, router, sendOtp])

    const isDisabled = mobilenumber.length !== 10 || sendOtp.isPending

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={10}>
            <SafeAreaView className='flex h-full flex-col items-center justify-center bg-white px-6'>
                <View className='w-full items-center'>
                    <Image
                        className='mb-6 h-40 w-40'
                        resizeMode='contain'
                        source={assets.Brand.Logo}
                    />

                    <SubHeading
                        text='Enter your mobile number'
                        className='mb-2 text-center'
                    />
                    <Paragraph
                        text='We will send you a verification code on your entered mobile number'
                        className='mb-8 px-4 text-center leading-5'
                    />

                    <View
                        className='mb-8 w-full flex-row items-center border-b-2 px-2 pb-3'
                        style={{ borderColor: colors.primary[600] }}>
                        <Text className='mr-2 text-base font-medium text-neutral-900'>+91</Text>
                        <View className='mr-2 h-5 w-px bg-neutral-300' />
                        <TextInput
                            keyboardType='number-pad'
                            placeholder='Enter your mobile number'
                            placeholderTextColor={colors.charcoal[400]}
                            className='flex-1 text-base text-neutral-900'
                            value={mobilenumber}
                            onChangeText={handleMobileNumberChange}
                            maxLength={10}
                            autoFocus
                        />
                    </View>

                    <Pressable
                        className={`w-full items-center justify-center rounded-xl py-4 ${isDisabled ? 'bg-neutral-300' : 'bg-primary-600'}`}
                        disabled={isDisabled}
                        onPress={handleSubmit}>
                        {sendOtp.isPending
                            ? (
                                <ActivityIndicator color='#ffffff' />
                            )
                            : (
                                <Text className={`text-base font-semibold ${isDisabled ? 'text-neutral-500' : 'text-white'}`}>
                                    Next
                                </Text>
                            )}
                    </Pressable>

                    <View className='mt-8 items-center'>
                        <Paragraph text='By signing in, you agree to' className='leading-5' />
                        <View className='mt-1 flex-row'>
                            <Paragraph text='Terms & Conditions' className='font-medium text-primary-600 underline' />
                            <Paragraph text='&' className='mx-1' />
                            <Paragraph text='Privacy Policy' className='font-medium text-primary-600 underline' />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}
