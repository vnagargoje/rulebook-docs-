import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, TextInput } from 'react-native'
import { Controller } from 'react-hook-form'
import { OtpInput } from 'react-native-otp-entry'

import { Button, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import colors from '@/components/ui/colors'
import { FieldWrapper, SectionCard, inputStyle } from '@/components/profile'
import { KycFailedScreen } from '@/components/kyc'
import { StepIndicator } from '@/components/shared/step-indicator'
import { useAadhaarVerification } from '@/hooks/customer/use-aadhaar-verification'

const KYC_STEPS = ['Aadhaar', 'PAN', 'License']

export default function AadhaarScreen() {
    const {
        phase,
        sessionId,
        captchaBase64,
        otp,
        otpInputRef,
        isConnecting,
        isFormSubmitting,
        isOtpSubmitting,
        isButtonDisabled,
        aadhaarState,
        formMethods,
        setOtp,
        handleFormSubmit,
        handleOtpSubmit,
        handleReloadCaptcha,
        handleBackToForm,
        handleContinueToPan,
    } = useAadhaarVerification()

    const { control, formState } = formMethods

    if (aadhaarState.isFailedMax) {
        return (
            <KycFailedScreen
                currentStep={1}
                title='Aadhaar'
                attemptCount={aadhaarState.attemptCount}
                buttonLabel='Continue to PAN'
                onContinue={handleContinueToPan}
            />
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
                    <StepIndicator steps={KYC_STEPS} currentStepIndex={0} />

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
                                control={control}
                                name='aadhaarNumber'
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FieldWrapper
                                        label='Aadhaar Number'
                                        required
                                        error={formState.errors.aadhaarNumber?.message}>
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
                                        disabled={isFormSubmitting}
                                        className='flex-row items-center gap-1 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2'>
                                        {isFormSubmitting ? (
                                            <ActivityIndicator size='small' color={colors.primary[600]} />
                                        ) : (
                                            <Text className='text-xs font-semibold text-primary-600'>↻ Reload</Text>
                                        )}
                                    </Pressable>
                                </View>
                            </View>

                            <Controller
                                control={control}
                                name='captcha'
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <FieldWrapper
                                        label='Enter Captcha'
                                        required
                                        error={formState.errors.captcha?.message}
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
                            <Pressable onPress={handleBackToForm} className='mt-5'>
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
                            loading={isFormSubmitting || isOtpSubmitting}
                            disabled={isButtonDisabled}
                            className='h-13 rounded-2xl bg-primary-600'
                            textClassName='text-base font-semibold text-white'
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}
