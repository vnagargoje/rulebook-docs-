import { Controller } from 'react-hook-form'
import { ActivityIndicator, KeyboardAvoidingView, Platform, TextInput } from 'react-native'

import { Button, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import colors from '@/components/ui/colors'
import { DobInputs, FieldWrapper, SectionCard, inputStyle } from '@/components/profile'
import { KycFailedScreen } from '@/components/kyc'
import { StepIndicator } from '@/components/shared/step-indicator'
import { useLicenseVerification } from '@/hooks/customer/use-license-verification'

const KYC_STEPS = ['Aadhaar', 'PAN', 'License']

export default function LicenseScreen() {
    const { phase, licenseState, formMethods, handleSubmit, handleContinue, isSubmitting } = useLicenseVerification()
    const { control, formState } = formMethods

    if (licenseState.isFailedMax) {
        return (
            <KycFailedScreen
                currentStep={3}
                aadhaarDone
                panDone
                title='Driving License'
                attemptCount={licenseState.attemptCount}
                buttonLabel='Continue'
                onContinue={handleContinue}
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
                    <StepIndicator steps={KYC_STEPS} currentStepIndex={2} />

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
                                    <FieldWrapper label='DL Number' required error={formState.errors.dlNumber?.message}>
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
                                        error={formState.errors.dateOfBirth?.message}
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
                                onPress={handleSubmit}
                                loading={isSubmitting}
                                disabled={isSubmitting}
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
