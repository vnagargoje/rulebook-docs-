import { zodResolver } from '@hookform/resolvers/zod'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react'

import { PROFILE_FORM_DEFAULT_VALUES, PROFILE_GENDER_OPTIONS } from '@/constants/profile.constants'
import {
    Button,
    Input,
    SafeAreaView,
    ScreenLoader,
    ScrollView,
    Text,
    View,
    showSuccessMessage,
} from '@/components/ui'
import { MY_PROFILE_QUERY_KEY, useMyProfile, useUpdateMyProfile } from '@/queries/profile'
import { profileSchema, type ProfileFormValues } from '@/schema/profile'
import { DobInputs } from './dob-inputs'
import { GenderPill } from './gender-pill'
import { SectionCard } from './section-card'
import { FieldWrapper } from './field-wrapper'

interface EditProfileScreenProps {
    onSuccess?: () => void
}

export function EditProfileScreen({ onSuccess }: EditProfileScreenProps = {}) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const updateProfile = useUpdateMyProfile()
    const { data: profile, isLoading } = useMyProfile()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        mode: 'onChange',
        defaultValues: PROFILE_FORM_DEFAULT_VALUES,
    })

    useEffect(() => {
        if (!profile) return
        reset({
            firstName: profile.firstName ?? '',
            lastName: profile.lastName ?? '',
            email: profile.email ?? '',
            gender: (profile.gender as ProfileFormValues['gender']) ?? '',
            dateOfBirth: profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : '',
        })
    }, [profile, reset])

    const fullPhone = useMemo(() => profile?.mobilenumber ?? 'Phone not available', [profile?.mobilenumber])

    const onSubmit = handleSubmit(async (values) => {
        const updatedProfile = await updateProfile.mutateAsync({
            data: {
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                email: values.email.trim() || undefined,
                gender: values.gender || undefined,
                dateOfBirth: values.dateOfBirth || undefined,
            },
        })
        queryClient.setQueryData([...MY_PROFILE_QUERY_KEY], updatedProfile)
        await queryClient.invalidateQueries({ queryKey: [...MY_PROFILE_QUERY_KEY] })
        showSuccessMessage('Profile updated successfully')
        if (onSuccess) {
            onSuccess()
        } else {
            router.back()
        }
    })

    if (isLoading || !profile) {
        return <ScreenLoader label='Loading profile...' />
    }

    return (
        <SafeAreaView edges={['bottom']} className='flex-1 bg-neutral-50'>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <View
                    className='mx-4 mt-4 flex-row items-center gap-3 rounded-2xl bg-white px-4 py-3.5'
                    style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
                    <View className='h-9 w-9 items-center justify-center rounded-xl bg-green-50'>
                        <MaterialCommunityIcons name='phone-check' size={18} color='#16A34A' />
                    </View>
                    <View className='flex-1'>
                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                            Verified Mobile
                        </Text>
                        <Text className='mt-0.5 text-[14px] font-bold text-neutral-900'>{fullPhone}</Text>
                    </View>
                    <View className='rounded-full bg-green-100 px-2.5 py-1'>
                        <Text className='text-[10px] font-bold text-green-700'>Active</Text>
                    </View>
                </View>

                <SectionCard title='Name'>
                    <Controller
                        control={control}
                        name='firstName'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FieldWrapper label='First Name' required error={errors.firstName?.message}>
                                <Input value={value} onBlur={onBlur} onChangeText={onChange} placeholder='Enter first name' />
                            </FieldWrapper>
                        )}
                    />
                    <Controller
                        control={control}
                        name='lastName'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FieldWrapper label='Last Name' required error={errors.lastName?.message} last>
                                <Input value={value} onBlur={onBlur} onChangeText={onChange} placeholder='Enter last name' />
                            </FieldWrapper>
                        )}
                    />
                </SectionCard>

                <SectionCard title='Contact'>
                    <Controller
                        control={control}
                        name='email'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FieldWrapper label='Email Address' error={errors.email?.message} last>
                                <Input
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    placeholder='name@example.com'
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    autoComplete='email'
                                />
                            </FieldWrapper>
                        )}
                    />
                </SectionCard>

                <SectionCard title='Personal'>
                    <Controller
                        control={control}
                        name='dateOfBirth'
                        render={({ field: { value, onChange } }) => (
                            <FieldWrapper label='Date of Birth' error={errors.dateOfBirth?.message}>
                                <DobInputs
                                    value={value}
                                    onChange={onChange}
                                />
                            </FieldWrapper>
                        )}
                    />

                    <Controller
                        control={control}
                        name='gender'
                        render={({ field: { value, onChange } }) => (
                            <View className='mt-1'>
                                <View className='mb-2 flex-row items-center gap-1'>
                                    <Text className='text-[13px] font-semibold text-neutral-700'>Gender</Text>
                                </View>
                                <View className='flex-row gap-2'>
                                    {PROFILE_GENDER_OPTIONS.map((opt) => (
                                        <GenderPill
                                            key={opt.value}
                                            label={opt.label}
                                            icon={opt.icon}
                                            isActive={value === opt.value}
                                            onPress={() => onChange(opt.value)}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}
                    />
                </SectionCard>

                <View className='mx-4 mt-6'>
                    <Button
                        label='Save Changes'
                        onPress={onSubmit}
                        loading={updateProfile.isPending}
                        disabled={updateProfile.isPending}
                        className='h-13 rounded-2xl bg-primary-600'
                        textClassName='text-base font-semibold text-white'
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
