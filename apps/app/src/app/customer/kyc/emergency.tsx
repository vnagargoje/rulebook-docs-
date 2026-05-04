import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, KeyboardAvoidingView, Platform, TextInput } from 'react-native'

import { Button, SafeAreaView, ScrollView, Text, View, showSuccessMessage } from '@/components/ui'
import { FieldWrapper } from '@/components/profile/field-wrapper'
import { SectionCard } from '@/components/profile/section-card'
import { MY_PROFILE_QUERY_KEY, useMyProfile, useUpdateMyProfile } from '@/queries/profile'
import { emergencyContactSchema, type EmergencyContactFormValues } from '@/schema/kyc/kyc.schema'

export default function EmergencyScreen() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: profile } = useMyProfile()
    const updateProfile = useUpdateMyProfile()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EmergencyContactFormValues>({
        resolver: zodResolver(emergencyContactSchema),
        mode: 'onChange',
        defaultValues: {
            contactName: '',
            contactMobile: '',
        },
    })

    const onSubmit = handleSubmit(async (values) => {
        Keyboard.dismiss()
        const existingProperties = profile?.properties ?? {}
        await updateProfile.mutateAsync({
            data: {
                properties: {
                    ...existingProperties,
                    emergencyContact: {
                        name: values.contactName.trim(),
                        mobile: values.contactMobile,
                    },
                },
            },
        })
        await queryClient.invalidateQueries({ queryKey: [...MY_PROFILE_QUERY_KEY] })
        showSuccessMessage('Setup complete! Welcome to Yugo.')
        router.replace('/customer')
    })

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
                    <View className='mx-4 mt-5 mb-2'>
                        <Text className='text-lg font-bold text-neutral-900'>Emergency Contact</Text>
                        <Text className='mt-1 text-sm text-neutral-500'>
                            Add someone we can reach in case of an emergency. This is the last step!
                        </Text>
                    </View>

                    <SectionCard title='Contact Details'>
                        <Controller
                            control={control}
                            name='contactName'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FieldWrapper
                                    label='Full Name'
                                    required
                                    error={errors.contactName?.message}>
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder='Enter full name'
                                        placeholderTextColor='#C4C9D4'
                                        style={inputStyle}
                                    />
                                </FieldWrapper>
                            )}
                        />

                        <Controller
                            control={control}
                            name='contactMobile'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FieldWrapper
                                    label='Mobile Number'
                                    required
                                    error={errors.contactMobile?.message}
                                    last>
                                    <TextInput
                                        value={value}
                                        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 10))}
                                        onBlur={onBlur}
                                        placeholder='9876543210'
                                        placeholderTextColor='#C4C9D4'
                                        keyboardType='phone-pad'
                                        maxLength={10}
                                        style={inputStyle}
                                    />
                                </FieldWrapper>
                            )}
                        />
                    </SectionCard>

                    <View className='mx-4 mt-4'>
                        <Button
                            label='Complete Setup'
                            onPress={onSubmit}
                            loading={updateProfile.isPending}
                            disabled={updateProfile.isPending}
                            className='h-13 rounded-2xl bg-primary-600'
                            textClassName='text-base font-semibold text-white'
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
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
