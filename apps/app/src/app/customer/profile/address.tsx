import { zodResolver } from '@hookform/resolvers/zod'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, Switch, TextInput } from 'react-native'

import { SearchablePickerModal, type PickerItem } from '@/components/shared/searchable-picker-modal'
import { Button, SafeAreaView, ScreenLoader, ScrollView, Text, View, showSuccessMessage } from '@/components/ui'
import colors from '@/components/ui/colors'
import { FieldWrapper, SectionCard, SelectTrigger, inputStyle } from '@/components/profile'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { useCitiesPicker, useStatesPicker } from '@/queries/customer/geographic.query'
import { useUpdateMyAddresses } from '@/queries/customer/kyc.query'
import { MY_PROFILE_QUERY_KEY, useMyProfile } from '@/queries/profile'
import { addressSchema, type AddressFormValues } from '@/schema/kyc/kyc.schema'

type PickerTarget =
    | 'permanent.state'
    | 'permanent.city'
    | 'current.state'
    | 'current.city'
    | null

export default function EditAddressScreen() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const updateAddresses = useUpdateMyAddresses()
    const { data: profile, isLoading: profileLoading } = useMyProfile()

    const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null)
    const [stateSearch, setStateSearch] = useState('')
    const [citySearch, setCitySearch] = useState('')
    const debouncedStateSearch = useDebounce(stateSearch, 400)
    const debouncedCitySearch = useDebounce(citySearch, 400)

    const permanentSaved = profile?.addresses?.find((a) => a.type === 'permanent')
    const currentSaved = profile?.addresses?.find((a) => a.type === 'current')

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        mode: 'onChange',
        defaultValues: {
            permanent: {
                lineOne: '',
                lineTwo: '',
                pincode: '',
                stateId: '',
                cityId: '',
                stateName: '',
                cityName: '',
            },
            sameAsPermanent: false,
            current: {
                lineOne: '',
                lineTwo: '',
                pincode: '',
                stateId: '',
                cityId: '',
                stateName: '',
                cityName: '',
            },
        },
    })

    useEffect(() => {
        if (!profile) return
        const perm = profile.addresses?.find((a) => a.type === 'permanent')
        const curr = profile.addresses?.find((a) => a.type === 'current')
        const same = !!curr && curr.id === perm?.id

        reset({
            permanent: {
                lineOne: perm?.lineOne ?? '',
                lineTwo: perm?.lineTwo ?? '',
                pincode: perm?.pincode ?? '',
                stateId: perm?.city?.state?.id ?? '',
                cityId: perm?.city?.id ?? '',
                stateName: perm?.city?.state?.name ?? '',
                cityName: perm?.city?.name ?? '',
            },
            sameAsPermanent: same,
            current: {
                lineOne: curr?.lineOne ?? '',
                lineTwo: curr?.lineTwo ?? '',
                pincode: curr?.pincode ?? '',
                stateId: curr?.city?.state?.id ?? '',
                cityId: curr?.city?.id ?? '',
                stateName: curr?.city?.state?.name ?? '',
                cityName: curr?.city?.name ?? '',
            },
        })
    }, [profile, reset])

    const sameAsPermanent = watch('sameAsPermanent')
    const permanentStateId = watch('permanent.stateId')
    const currentStateId = watch('current.stateId')

    const activeCityStateId = useMemo(() => {
        if (pickerTarget === 'permanent.city') return permanentStateId
        if (pickerTarget === 'current.city') return currentStateId
        return ''
    }, [pickerTarget, permanentStateId, currentStateId])

    const {
        data: statesData,
        isLoading: statesLoading,
        isFetchingNextPage: statesFetchingMore,
        hasNextPage: statesHasNext,
        fetchNextPage: statesFetchNext,
    } = useStatesPicker({
        variables: {
            search: debouncedStateSearch,
        },
        enabled: pickerTarget === 'permanent.state' || pickerTarget === 'current.state',
    })

    const {
        data: citiesData,
        isLoading: citiesLoading,
        isFetchingNextPage: citiesFetchingMore,
        hasNextPage: citiesHasNext,
        fetchNextPage: citiesFetchNext,
    } = useCitiesPicker({
        variables: {
            stateId: activeCityStateId ?? '',
            search: debouncedCitySearch,
        },
        enabled:
            !!activeCityStateId &&
            (pickerTarget === 'permanent.city' || pickerTarget === 'current.city'),
    })

    const allStates: PickerItem[] = useMemo(
        () => statesData?.pages.flatMap((p) => p.data) ?? [],
        [statesData?.pages],
    )
    const allCities: PickerItem[] = useMemo(
        () => citiesData?.pages.flatMap((p) => p.data) ?? [],
        [citiesData?.pages],
    )

    const openPicker = useCallback((target: PickerTarget) => {
        Keyboard.dismiss()
        setStateSearch('')
        setCitySearch('')
        setPickerTarget(target)
    }, [])

    const closePicker = useCallback(() => setPickerTarget(null), [])

    const handleSelectState = useCallback(
        (item: PickerItem) => {
            if (pickerTarget === 'permanent.state') {
                setValue('permanent.stateId', item.id)
                setValue('permanent.stateName', item.name)
                setValue('permanent.cityId', '')
                setValue('permanent.cityName', '')
            } else if (pickerTarget === 'current.state') {
                setValue('current.stateId', item.id)
                setValue('current.stateName', item.name)
                setValue('current.cityId', '')
                setValue('current.cityName', '')
            }
            closePicker()
        },
        [pickerTarget, setValue, closePicker],
    )

    const handleSelectCity = useCallback(
        (item: PickerItem) => {
            if (pickerTarget === 'permanent.city') {
                setValue('permanent.cityId', item.id)
                setValue('permanent.cityName', item.name)
            } else if (pickerTarget === 'current.city') {
                setValue('current.cityId', item.id)
                setValue('current.cityName', item.name)
            }
            closePicker()
        },
        [pickerTarget, setValue, closePicker],
    )

    const isStatePicker = pickerTarget === 'permanent.state' || pickerTarget === 'current.state'
    const isCityPicker = pickerTarget === 'permanent.city' || pickerTarget === 'current.city'

    const onSubmit = handleSubmit(async (values) => {
        const buildAddr = (addr: typeof values.permanent) => ({
            lineOne: addr.lineOne,
            lineTwo: addr.lineTwo || undefined,
            pincode: addr.pincode,
            cityId: addr.cityId || undefined,
        })

        const permanentAddr = buildAddr(values.permanent)
        const currentAddr = values.sameAsPermanent
            ? permanentAddr
            : buildAddr(values.current as typeof values.permanent)

        await updateAddresses.mutateAsync({ permanent: permanentAddr, current: currentAddr })
        await queryClient.invalidateQueries({ queryKey: [...MY_PROFILE_QUERY_KEY] })
        showSuccessMessage('Address updated successfully')
        router.back()
    })

    if (profileLoading) {
        return <ScreenLoader label='Loading address…' />
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

                    <SectionCard title='Permanent Address'>
                        <Controller
                            control={control}
                            name='permanent.lineOne'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FieldWrapper
                                    label='Address Line 1'
                                    required
                                    error={errors.permanent?.lineOne?.message}>
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder='Flat, Building, Street, Landmark'
                                        placeholderTextColor='#C4C9D4'
                                        style={inputStyle}
                                    />
                                </FieldWrapper>
                            )}
                        />
                        <Controller
                            control={control}
                            name='permanent.lineTwo'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FieldWrapper label='Address Line 2 (Optional)'>
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder='Area, Colony (optional)'
                                        placeholderTextColor='#C4C9D4'
                                        style={inputStyle}
                                    />
                                </FieldWrapper>
                            )}
                        />
                        <Controller
                            control={control}
                            name='permanent.pincode'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FieldWrapper
                                    label='Pincode'
                                    required
                                    error={errors.permanent?.pincode?.message}>
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
                            name='permanent.stateId'
                            render={() => (
                                <FieldWrapper
                                    label='State'
                                    required
                                    error={errors.permanent?.stateId?.message}>
                                    <SelectTrigger
                                        value={watch('permanent.stateName')}
                                        placeholder='Select state'
                                        onPress={() => openPicker('permanent.state')}
                                    />
                                </FieldWrapper>
                            )}
                        />
                        <Controller
                            control={control}
                            name='permanent.cityId'
                            render={() => (
                                <FieldWrapper
                                    label='City'
                                    required
                                    error={errors.permanent?.cityId?.message}
                                    last>
                                    <SelectTrigger
                                        value={watch('permanent.cityName')}
                                        placeholder={permanentStateId ? 'Select city' : 'Select state first'}
                                        disabled={!permanentStateId}
                                        onPress={() =>
                                            permanentStateId ? openPicker('permanent.city') : undefined
                                        }
                                    />
                                </FieldWrapper>
                            )}
                        />
                    </SectionCard>

                    <SectionCard title='Current Address'>
                        <Controller
                            control={control}
                            name='sameAsPermanent'
                            render={({ field: { value, onChange } }) => (
                                <Pressable
                                    onPress={() => onChange(!value)}
                                    className='mb-4 flex-row items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3.5'>
                                    <View className='flex-1 pr-3'>
                                        <Text className='text-[14px] font-semibold text-neutral-900'>
                                            Same as permanent address
                                        </Text>
                                        <Text className='mt-0.5 text-xs text-neutral-400'>
                                            My current address matches permanent address
                                        </Text>
                                    </View>
                                    <Switch
                                        value={value}
                                        onValueChange={onChange}
                                        trackColor={{ false: '#E5E7EB', true: colors.primary[200] }}
                                        thumbColor={value ? colors.primary[600] : '#9CA3AF'}
                                    />
                                </Pressable>
                            )}
                        />

                        {sameAsPermanent ? (
                            <View className='flex-row items-start gap-3 rounded-2xl bg-primary-50 px-4 py-3.5'>
                                <MaterialCommunityIcons
                                    name='check-circle-outline'
                                    size={18}
                                    color={colors.primary[600]}
                                    style={{ marginTop: 1 }}
                                />
                                <View className='flex-1'>
                                    <Text className='text-[13px] font-semibold text-primary-700'>
                                        Using permanent address
                                    </Text>
                                    {watch('permanent.lineOne') ? (
                                        <Text
                                            className='mt-0.5 text-xs text-primary-500'
                                            numberOfLines={2}>
                                            {[
                                                watch('permanent.lineOne'),
                                                watch('permanent.cityName'),
                                                watch('permanent.stateName'),
                                            ]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        ) : (
                            <>
                                <Controller
                                    control={control}
                                    name='current.lineOne'
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <FieldWrapper
                                            label='Address Line 1'
                                            required
                                            error={(errors as any).current?.lineOne?.message}>
                                            <TextInput
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                placeholder='Flat, Building, Street, Landmark'
                                                placeholderTextColor='#C4C9D4'
                                                style={inputStyle}
                                            />
                                        </FieldWrapper>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name='current.lineTwo'
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <FieldWrapper label='Address Line 2 (Optional)'>
                                            <TextInput
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                placeholder='Area, Colony (optional)'
                                                placeholderTextColor='#C4C9D4'
                                                style={inputStyle}
                                            />
                                        </FieldWrapper>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name='current.pincode'
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <FieldWrapper
                                            label='Pincode'
                                            required
                                            error={(errors as any).current?.pincode?.message}>
                                            <TextInput
                                                value={value}
                                                onChangeText={(t) =>
                                                    onChange(t.replace(/\D/g, '').slice(0, 6))
                                                }
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
                                    name='current.stateId'
                                    render={() => (
                                        <FieldWrapper
                                            label='State'
                                            required
                                            error={(errors as any).current?.stateId?.message}>
                                            <SelectTrigger
                                                value={watch('current.stateName')}
                                                placeholder='Select state'
                                                onPress={() => openPicker('current.state')}
                                            />
                                        </FieldWrapper>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name='current.cityId'
                                    render={() => (
                                        <FieldWrapper
                                            label='City'
                                            required
                                            error={(errors as any).current?.cityId?.message}
                                            last>
                                            <SelectTrigger
                                                value={watch('current.cityName')}
                                                placeholder={
                                                    currentStateId ? 'Select city' : 'Select state first'
                                                }
                                                disabled={!currentStateId}
                                                onPress={() =>
                                                    currentStateId
                                                        ? openPicker('current.city')
                                                        : undefined
                                                }
                                            />
                                        </FieldWrapper>
                                    )}
                                />
                            </>
                        )}
                    </SectionCard>

                    <View className='mx-4 mt-4'>
                        <Button
                            label='Save Address'
                            onPress={onSubmit}
                            loading={updateAddresses.isPending}
                            disabled={updateAddresses.isPending}
                            className='h-13 rounded-2xl bg-primary-600'
                            textClassName='text-base font-semibold text-white'
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>

            <SearchablePickerModal
                visible={isStatePicker}
                title={
                    pickerTarget === 'permanent.state'
                        ? 'Permanent — Select State'
                        : 'Current — Select State'
                }
                items={allStates}
                isLoading={statesLoading}
                isFetchingMore={statesFetchingMore}
                hasNextPage={statesHasNext}
                onEndReached={() => {
                    if (statesHasNext && !statesFetchingMore) statesFetchNext()
                }}
                onClose={closePicker}
                onSelect={handleSelectState}
                onSearch={setStateSearch}
                searchValue={stateSearch}
                selectedId={
                    pickerTarget === 'permanent.state'
                        ? watch('permanent.stateId')
                        : watch('current.stateId')
                }
                placeholder='Search state…'
            />

            <SearchablePickerModal
                visible={isCityPicker}
                title={
                    pickerTarget === 'permanent.city'
                        ? 'Permanent — Select City'
                        : 'Current — Select City'
                }
                items={allCities}
                isLoading={citiesLoading}
                isFetchingMore={citiesFetchingMore}
                hasNextPage={citiesHasNext}
                onEndReached={() => {
                    if (citiesHasNext && !citiesFetchingMore) citiesFetchNext()
                }}
                onClose={closePicker}
                onSelect={handleSelectCity}
                onSearch={setCitySearch}
                searchValue={citySearch}
                selectedId={
                    pickerTarget === 'permanent.city'
                        ? watch('permanent.cityId')
                        : watch('current.cityId')
                }
                placeholder='Search city…'
            />
        </KeyboardAvoidingView>
    )
}
