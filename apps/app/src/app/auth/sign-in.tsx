import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { assets } from '@/assets'
import { Checkbox, Paragraph, SubHeading, Text, View, SafeAreaView, Image } from '@/components/ui'
import colors from '@/components/ui/colors'
import { normalizeMobileNumber } from '@/components/auth/auth.utils'
import { useSendOtp } from '@/queries/auth.query'
import { openLinkInBrowser } from '@/lib/utils'

export default function SignInPage() {
    const router = useRouter()
    const { redirect, planId } = useLocalSearchParams<{ redirect?: string; planId?: string }>()
    const [mobilenumber, setMobilenumber] = useState('')
    const [isTermsAccepted, setIsTermsAccepted] = useState(false)
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

    const isDisabled = mobilenumber.length !== 10 || !isTermsAccepted || sendOtp.isPending

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
                            text='Enter your mobile number'
                            className='mb-4 text-center'
                        />
                        <Paragraph
                            text='We will send you a verification code on your entered mobile number'
                            className='mb-6 px-4 text-center leading-5'
                        />

                        <View
                            className='mb-6 w-full flex-row items-center border-b-2 px-2 pb-3'
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

                        <View className='mt-8 w-full pb-5'>
                            <Checkbox.Root
                                checked={isTermsAccepted}
                                onChange={setIsTermsAccepted}
                                accessibilityLabel='Accept Terms & Conditions and Privacy Policy'
                                className='mb-6 items-start'>
                                <View className='pt-0.5'>
                                    <Checkbox.Icon checked={isTermsAccepted} />
                                </View>
                                <Text className='ml-3 flex-1 text-sm leading-5 text-neutral-600'>
                                    By signing in, you agree to{' '}
                                    <Text
                                        onPress={() => openLinkInBrowser('https://yugo.net/terms')}
                                        className='font-semibold text-primary-600 underline'>
                                        Terms & Conditions
                                    </Text>{' '}
                                    &{' '}
                                    <Text
                                        onPress={() => openLinkInBrowser('https://yugo.net/privacy')}
                                        className='font-semibold text-primary-600 underline'>
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </Checkbox.Root>

                            <Pressable
                                className={`w-full items-center justify-center rounded-xl py-4 ${isDisabled ? 'bg-neutral-200' : 'bg-primary-600 active:bg-primary-700'}`}
                                disabled={isDisabled}
                                onPress={handleSubmit}>
                                {sendOtp.isPending
                                    ? (
                                        <ActivityIndicator color='#ffffff' />
                                    )
                                    : (
                                        <Text className={`text-base font-semibold ${isDisabled ? 'text-neutral-400' : 'text-white'}`}>
                                            Next
                                        </Text>
                                    )}
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}
