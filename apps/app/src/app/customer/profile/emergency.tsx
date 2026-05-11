import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, KeyboardAvoidingView, Platform, TextInput } from 'react-native'

import { Button, SafeAreaView, ScreenLoader, ScrollView, Text, View, showSuccessMessage } from '@/components/ui'
import { FieldWrapper, SectionCard } from '@/components/profile'
import { MY_PROFILE_QUERY_KEY, useMyProfile, useUpdateMyProfile } from '@/queries/profile'
import { emergencyContactSchema, type EmergencyContactFormValues } from '@/schema/kyc/kyc.schema'

export default function EditEmergencyScreen() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: profile, isLoading: profileLoading } = useMyProfile()
    const updateProfile = useUpdateMyProfile()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EmergencyContactFormValues>({
        resolver: zodResolver(emergencyContactSchema),
        mode: 'onChange',
        defaultValues: {
            contactName: '',
            contactMobile: '',
        },
    })

    useEffect(() => {
        const ec = profile?.properties?.emergencyContact as
            | { name?: string; mobile?: string }
            | undefined
        if (!ec) return
        reset({
            contactName: ec.name ?? '',
            contactMobile: ec.mobile ?? '',
        })
    }, [profile, reset])

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
        showSuccessMessage('Emergency contact updated successfully')
        router.back()
    })

    if (profileLoading) {
        return <ScreenLoader label='Loading…' />
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}>
            <SafeAreaView edges={['bottom']} className='flex-1 bg-neutral-50'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{ paddingBottom: 40 }}>

                    <View className='mx-4 mt-5 mb-1'>
                        <Text className='text-sm text-neutral-500'>
                            This person will be contacted in case of an emergency.
                        </Text>
                    </View>

                    <SectionCard title='Emergency Contact'>
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
                                        placeholder='Enter contact name'
                                        placeholderTextColor='#C4C9D4'
                                        autoCapitalize='words'
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
                                        placeholder='10-digit mobile number'
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
                            label='Save Contact'
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
