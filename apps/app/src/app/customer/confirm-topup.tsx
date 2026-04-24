import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useQueryClient } from '@tanstack/react-query'

import { StatTile } from '@/components/customer/shared'

import { Button, FocusAwareStatusBar, Pressable, ScreenLoader, ScrollView, Text, View } from '@/components/ui'
import { formatCurrencyIN, formatKmIN, formatNumberIN, toSafeNumber } from '@/lib/formatters/customer'
import { useApplyTopUp, useTopUpById } from '@/queries/customer'
import { useMyPlans } from '@/queries/customer'

export default function ConfirmTopUpScreen() {
    const { topUpId } = useLocalSearchParams<{ topUpId: string }>()
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: topUp, isLoading: topUpLoading } = useTopUpById({
        variables: topUpId ? { id: topUpId } : undefined,
        enabled: Boolean(topUpId),
    })
    const { data: myPlansData, isLoading: plansLoading } = useMyPlans({ variables: { status: 'active' } })
    const applyTopUp = useApplyTopUp()

    const activePlans = myPlansData?.data ?? []

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

    const isPending = applyTopUp.isPending

    const handleConfirm = useCallback(() => {
        const userPlanId = selectedPlanId ?? (activePlans.length === 1 ? activePlans[0].id : null)
        if (!topUpId || !userPlanId) return

        applyTopUp.mutate(
            { topUpId, userPlanId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['user-plans'] })
                    queryClient.invalidateQueries({ queryKey: ['bookings'] })
                    router.replace({
                        pathname: '/customer/topup-success',
                        params: { topUpId, userPlanId },
                    })
                },
            },
        )
    }, [topUpId, selectedPlanId, activePlans, applyTopUp, queryClient, router])

    const totalAmount = topUp
        ? toSafeNumber(topUp.price) + toSafeNumber(topUp.gst)
        : 0

    if (topUpLoading || plansLoading) {
        return <ScreenLoader />
    }

    if (!topUp) {
        return (
            <View className='flex-1 items-center justify-center bg-white'>
                <MaterialCommunityIcons name='alert-circle-outline' size={48} color='#EF4444' />
                <Text className='mt-4 text-lg font-semibold text-neutral-900'>Top-up not found</Text>
                <Button label='Go Back' onPress={() => router.back()} className='mt-4 bg-primary-600 px-8' textClassName='text-white font-semibold' />
            </View>
        )
    }

    return (
        <>
            <FocusAwareStatusBar />
            <View className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}>
                    <View className='gap-4'>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                            <View className='flex-row items-start justify-between'>
                                <View className='flex-1 pr-3'>
                                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                        Top-Up
                                    </Text>
                                    <Text className='mt-1 text-lg font-bold text-neutral-900'>{topUp.name}</Text>
                                    {topUp.description ? (
                                        <View className='mt-1.5 flex-row items-center gap-1.5'>
                                            <MaterialCommunityIcons name='information-outline' size={13} color='#9CA3AF' />
                                            <Text className='flex-1 text-sm text-neutral-500'>{topUp.description}</Text>
                                        </View>
                                    ) : null}
                                </View>
                                <View className='items-end'>
                                    <Text className='text-xl font-bold text-primary-600'>
                                        {formatCurrencyIN(totalAmount)}
                                    </Text>
                                    <Text className='text-[10px] text-neutral-400'>incl. GST</Text>
                                </View>
                            </View>

                            <View className='mt-4 flex-row gap-3'>
                                <StatTile label='KM Added' value={`+${formatNumberIN(topUp.kmLimit)} km`} tint='success' />
                                {topUp.validityDays > 0 ? (
                                    <StatTile label='Days Extended' value={`+${topUp.validityDays} days`} tint='primary' />
                                ) : null}
                                <StatTile label='Base Price' value={formatCurrencyIN(topUp.price)} />
                            </View>
                        </View>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                Apply to Plan
                            </Text>
                            <Text className='mt-1 text-base font-bold text-neutral-900'>
                                Select your active plan
                            </Text>

                            {activePlans.length === 0 ? (
                                <View className='mt-4 items-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 py-8'>
                                    <MaterialCommunityIcons name='alert-circle-outline' size={40} color='#D1D5DB' />
                                    <Text className='mt-3 text-base font-semibold text-neutral-700'>
                                        No active plan found
                                    </Text>
                                    <Text className='mt-1 text-center text-sm text-neutral-500'>
                                        You need an active plan to apply a top-up.{'\n'}Purchase a plan first.
                                    </Text>
                                    <Button
                                        label='Browse Plans'
                                        onPress={() => router.push('/customer/(tabs)/plans')}
                                        className='mt-4 bg-primary-600 px-6'
                                        textClassName='text-white font-semibold'
                                    />
                                </View>
                            ) : (
                                <View className='mt-4 gap-3'>
                                    {activePlans.map((plan) => {
                                        const isSelected = (selectedPlanId ?? (activePlans.length === 1 ? activePlans[0].id : null)) === plan.id
                                        return (
                                            <Pressable key={plan.id} onPress={() => setSelectedPlanId(plan.id)}>
                                                <View
                                                    className={`flex-row items-center gap-4 rounded-2xl border p-4 ${
                                                        isSelected
                                                            ? 'border-primary-300 bg-primary-50'
                                                            : 'border-neutral-200 bg-neutral-50'
                                                    }`}>
                                                    <View
                                                        className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                            isSelected ? 'border-primary-600' : 'border-neutral-300'
                                                        }`}>
                                                        {isSelected && (
                                                            <View className='h-2.5 w-2.5 rounded-full bg-primary-600' />
                                                        )}
                                                    </View>
                                                    <View className='flex-1'>
                                                        <Text className='text-[15px] font-semibold text-neutral-900'>
                                                            {(plan.planSnapshot as any)?.name ?? 'Plan'}
                                                        </Text>
                                                        <Text className='mt-0.5 text-xs text-neutral-500'>
                                                            {formatKmIN(plan.remainingKm)} remaining
                                                        </Text>
                                                    </View>
                                                    <View className='rounded-full bg-success-100 px-2.5 py-1'>
                                                        <Text className='text-xs font-bold text-success-700'>Active</Text>
                                                    </View>
                                                </View>
                                            </Pressable>
                                        )
                                    })}
                                </View>
                            )}
                        </View>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                Payment Summary
                            </Text>
                            <View className='mt-3 gap-0'>
                                <View className='flex-row items-center justify-between py-3'>
                                    <Text className='text-sm text-neutral-500'>Base price</Text>
                                    <Text className='text-sm font-medium text-neutral-900'>
                                        {formatCurrencyIN(topUp.price)}
                                    </Text>
                                </View>
                                <View className='border-b border-neutral-100' />
                                <View className='flex-row items-center justify-between py-3'>
                                    <Text className='text-sm text-neutral-500'>GST</Text>
                                    <Text className='text-sm font-medium text-neutral-900'>
                                        {formatCurrencyIN(topUp.gst)}
                                    </Text>
                                </View>
                                <View className='border-b border-neutral-100' />
                                <View className='flex-row items-center justify-between pt-3'>
                                    <Text className='text-base font-bold text-neutral-900'>Total</Text>
                                    <Text className='text-base font-bold text-primary-600'>
                                        {formatCurrencyIN(totalAmount)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                What will change
                            </Text>
                            <View className='mt-3 gap-3'>
                                <View className='flex-row items-center gap-3'>
                                    <View className='h-7 w-7 items-center justify-center rounded-xl bg-success-50'>
                                        <MaterialCommunityIcons name='check' size={14} color='#16A34A' />
                                    </View>
                                    <Text className='text-sm text-neutral-700'>
                                        +{formatKmIN(topUp.kmLimit).replace(' km', '')} km added instantly
                                    </Text>
                                </View>
                                {topUp.validityDays > 0 ? (
                                    <View className='flex-row items-center gap-3'>
                                        <View className='h-7 w-7 items-center justify-center rounded-xl bg-primary-50'>
                                            <MaterialCommunityIcons name='check' size={14} color='#2563EB' />
                                        </View>
                                        <Text className='text-sm text-neutral-700'>
                                            Plan extended by {topUp.validityDays} days
                                        </Text>
                                    </View>
                                ) : null}
                                <View className='flex-row items-center gap-3'>
                                    <View className='h-7 w-7 items-center justify-center rounded-xl bg-success-50'>
                                        <MaterialCommunityIcons name='check' size={14} color='#16A34A' />
                                    </View>
                                    <Text className='text-sm text-neutral-700'>Changes apply instantly</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                </ScrollView>

                <View className='absolute bottom-0 left-0 right-0 border-t border-neutral-100 bg-white px-4 pb-8 pt-4'>
                    <Button
                        label={isPending ? 'Applying...' : 'Confirm Top-Up'}
                        onPress={handleConfirm}
                        disabled={!(selectedPlanId ?? (activePlans.length === 1 ? activePlans[0].id : null)) || activePlans.length === 0 || isPending}
                        className={`h-14 rounded-2xl ${
                            (selectedPlanId ?? (activePlans.length === 1 ? activePlans[0].id : null)) && activePlans.length > 0
                                ? 'bg-primary-600'
                                : 'bg-neutral-300'
                        }`}
                        textClassName='text-base font-semibold text-white'
                    />
                    <Text className='mt-2 text-center text-xs text-neutral-400'>
                        Payment integration coming soon. Top-up is free for now.
                    </Text>
                </View>
            </View>
        </>
    )
}
