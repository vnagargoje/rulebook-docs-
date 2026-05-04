import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    TextInput,
} from 'react-native'

import { Button, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { FieldWrapper } from '@/components/profile/field-wrapper'
import { SectionCard } from '@/components/profile/section-card'
import { client } from '@/lib/api/client'
import { useUpdateMyAddress } from '@/queries/customer/kyc.query'
import { addressSchema, type AddressFormValues } from '@/schema/kyc/kyc.schema'
import colors from '@/components/ui/colors'

type StateItem = { id: string; name: string }
type CityItem = { id: string; name: string }

export default function AddressScreen() {
    const router = useRouter()
    const updateAddress = useUpdateMyAddress()

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        mode: 'onChange',
        defaultValues: {
            lineOne: '',
            pincode: '',
            stateId: '',
            cityId: '',
            stateName: '',
            cityName: '',
        },
    })

    const stateId = watch('stateId')

    const { data: statesData, isLoading: statesLoading } = useQuery({
        queryKey: ['states'],
        queryFn: async () => {
            const res = await client.v1.v1StatesListManyStates({ sortBy: ['name:ASC'], limit: 100 })
            return res.data.data
        },
    })

    const { data: citiesData, isLoading: citiesLoading } = useQuery({
        queryKey: ['cities', stateId],
        queryFn: async () => {
            const res = await client.v1.v1CitiesListManyCities({
                'filter.state.id': [`$eq:${stateId}`],
                sortBy: ['name:ASC'],
                limit: 200,
            })
            return res.data.data
        },
        enabled: !!stateId,
    })

    const [pickerType, setPickerType] = useState<'state' | 'city' | null>(null)

    const openPicker = (type: 'state' | 'city') => {
        Keyboard.dismiss()
        setPickerType(type)
    }

    const handleSelectState = useCallback(
        (item: StateItem) => {
            setValue('stateId', item.id)
            setValue('stateName', item.name)
            setValue('cityId', '')
            setValue('cityName', '')
            setPickerType(null)
        },
        [setValue],
    )

    const handleSelectCity = useCallback(
        (item: CityItem) => {
            setValue('cityId', item.id)
            setValue('cityName', item.name)
            setPickerType(null)
        },
        [setValue],
    )

    const onSubmit = handleSubmit(async (values) => {
        await updateAddress.mutateAsync({
            lineOne: values.lineOne,
            pincode: values.pincode,
            cityId: values.cityId,
        })
        router.replace('/customer/kyc/emergency')
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
                        <Text className='text-lg font-bold text-neutral-900'>Address Details</Text>
                        <Text className='mt-1 text-sm text-neutral-500'>
                            Provide your residential address.
                        </Text>
                    </View>

                    <SectionCard title='Address'>
                        <Controller
                            control={control}
                            name='lineOne'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FieldWrapper label='Address Line 1' required error={errors.lineOne?.message}>
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder='Flat, Building, Street'
                                        placeholderTextColor='#C4C9D4'
                                        style={inputStyle}
                                    />
                                </FieldWrapper>
                            )}
                        />

                        <Controller
                            control={control}
                            name='pincode'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FieldWrapper label='Pincode' required error={errors.pincode?.message}>
                                    <TextInput
                                        value={value}
                                        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 6))}
                                        onBlur={onBlur}
                                        placeholder='560001'
                                        placeholderTextColor='#C4C9D4'
                                        keyboardType='number-pad'
                                        maxLength={6}
                                        style={inputStyle}
                                    />
                                </FieldWrapper>
                            )}
                        />

                        <Controller
                            control={control}
                            name='stateId'
                            render={() => (
                                <FieldWrapper label='State' required error={errors.stateId?.message}>
                                    <Pressable onPress={() => openPicker('state')} style={inputStyle}>
                                        <Text
                                            style={{
                                                color: watch('stateName') ? '#111827' : '#C4C9D4',
                                                fontSize: 15,
                                                lineHeight: 52,
                                            }}>
                                            {watch('stateName') || 'Select state'}
                                        </Text>
                                    </Pressable>
                                </FieldWrapper>
                            )}
                        />

                        <Controller
                            control={control}
                            name='cityId'
                            render={() => (
                                <FieldWrapper label='City' required error={errors.cityId?.message} last>
                                    <Pressable
                                        onPress={() => stateId && openPicker('city')}
                                        style={[inputStyle, !stateId && { opacity: 0.5 }]}>
                                        <Text
                                            style={{
                                                color: watch('cityName') ? '#111827' : '#C4C9D4',
                                                fontSize: 15,
                                                lineHeight: 52,
                                            }}>
                                            {watch('cityName') || 'Select city'}
                                        </Text>
                                    </Pressable>
                                </FieldWrapper>
                            )}
                        />
                    </SectionCard>

                    <View className='mx-4 mt-4'>
                        <Button
                            label='Save & Continue'
                            onPress={onSubmit}
                            loading={updateAddress.isPending}
                            disabled={updateAddress.isPending}
                            className='h-13 rounded-2xl bg-primary-600'
                            textClassName='text-base font-semibold text-white'
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Modal
                visible={!!pickerType}
                animationType='slide'
                presentationStyle='pageSheet'
                onRequestClose={() => setPickerType(null)}>
                <SafeAreaView edges={['top', 'bottom']} className='flex-1 bg-white'>
                    <View className='flex-row items-center justify-between border-b border-neutral-100 px-4 py-3'>
                        <Text className='text-base font-bold text-neutral-900'>
                            {pickerType === 'state' ? 'Select State' : 'Select City'}
                        </Text>
                        <Pressable onPress={() => setPickerType(null)} className='px-2 py-1'>
                            <Text className='text-sm font-medium text-primary-600'>Cancel</Text>
                        </Pressable>
                    </View>
                    {(pickerType === 'state' ? statesLoading : citiesLoading) ? (
                        <View className='flex-1 items-center justify-center'>
                            <ActivityIndicator size='large' color={colors.primary[600]} />
                        </View>
                    ) : (
                        <FlatList
                            data={pickerType === 'state' ? statesData : citiesData}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() =>
                                        pickerType === 'state'
                                            ? handleSelectState(item as StateItem)
                                            : handleSelectCity(item as CityItem)
                                    }
                                    className='border-b border-neutral-50 px-4 py-3.5'>
                                    <Text className='text-sm text-neutral-900'>{item.name}</Text>
                                </Pressable>
                            )}
                        />
                    )}
                </SafeAreaView>
            </Modal>
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
    justifyContent: 'center' as const,
}
