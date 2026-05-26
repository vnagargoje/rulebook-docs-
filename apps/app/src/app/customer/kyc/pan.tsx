import { Controller } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native'

import { Button, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { FieldWrapper, SectionCard, inputStyle } from '@/components/profile'
import { KycFailedScreen } from '@/components/kyc'
import { StepIndicator } from '@/components/shared/step-indicator'
import { usePanVerification } from '@/hooks/customer/use-pan-verification'

const KYC_STEPS = ['Aadhaar', 'PAN', 'License']

export default function PanScreen() {
    const { panState, formMethods, handleSubmit, handleContinueToLicense, isSubmitting } = usePanVerification()
    const { control, formState, setValue } = formMethods

    if (panState.isFailedMax) {
        return (
            <KycFailedScreen
                currentStep={2}
                aadhaarDone
                title='PAN'
                attemptCount={panState.attemptCount}
                buttonLabel='Continue to Driving License'
                onContinue={handleContinueToLicense}
            />
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
                    <StepIndicator steps={KYC_STEPS} currentStepIndex={1} />

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
                                <FieldWrapper label='PAN Number' required error={formState.errors.pan?.message} last>
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
                                        style={{ ...inputStyle, letterSpacing: 1.5 }}
                                    />
                                </FieldWrapper>
                            )}
                        />
                    </SectionCard>

                    <View className='mx-4 mt-4'>
                        <Button
                            label='Verify PAN'
                            onPress={handleSubmit}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className='h-13 rounded-2xl bg-primary-600'
                            textClassName='text-base font-semibold text-white'
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}
