import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { PriceRow, StatTile } from '@/components/customer/plan-detail'
import { Button, ScreenLoader, ScrollView, Text, View } from '@/components/ui'
import { formatCurrencyIN, formatKmIN } from '@/lib/formatters/customer'
import { usePlanById } from '@/queries/customer'
import { useAuthStore } from '@/stores/auth.store'

export default function PlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const router = useRouter()
    const token = useAuthStore.use.token()
    const { data: plan, isLoading } = usePlanById({ variables: { id: id! } })

    const handleSelectPlan = useCallback(() => {
        if (!id) return

        if (!token?.access) {
            router.push({
                pathname: '/auth/sign-in',
                params: { redirect: '/customer/confirm-booking', planId: id },
            })
            return
        }

        router.push({ pathname: '/customer/confirm-booking', params: { planId: id } })
    }, [router, id, token?.access])

    if (isLoading || !plan) {
        return <ScreenLoader label='Loading plan details...' />
    }

    return (
        <>
            <View className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}>
                    <View className='gap-4'>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                            <View className='flex-row items-start justify-between'>
                                <View className='flex-1 pr-3'>
                                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                        Plan
                                    </Text>
                                    <Text className='mt-1 text-xl font-bold text-neutral-900'>{plan.name}</Text>
                                    {plan.description ? (
                                        <Text className='mt-1.5 text-sm leading-5 text-neutral-500'>{plan.description}</Text>
                                    ) : null}
                                </View>
                                <View className='items-end'>
                                    <Text className='text-2xl font-bold text-primary-600'>
                                        {formatCurrencyIN(plan.price)}
                                    </Text>
                                    <Text className='text-[10px] text-neutral-400'>/{plan.validityDays} days</Text>
                                </View>
                            </View>

                            <View className='mt-4 flex-row gap-2'>
                                <StatTile
                                    label='Validity'
                                    value={`${plan.validityDays} days`}
                                    tint='primary'
                                />
                                <StatTile
                                    label='KM Limit'
                                    value={formatKmIN(plan.kmLimit)}
                                    tint='success'
                                />
                                <StatTile
                                    label='Swaps'
                                    value='Unlimited'
                                    tint='neutral'
                                />
                            </View>
                        </View>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                What you get
                            </Text>
                            <View className='mt-4 gap-3.5'>
                                {[
                                    { icon: 'motorbike-electric', text: 'EV vehicle assigned to you' },
                                    { icon: 'battery-charging', text: 'Unlimited battery swaps at any hub' },
                                    { icon: 'shield-check-outline', text: 'Full insurance coverage included' },
                                    { icon: 'headset', text: 'Priority roadside support 24/7' },
                                    { icon: 'cash-refund', text: 'Refundable security deposit' },
                                ].map((item) => (
                                    <View key={item.text} className='flex-row items-center gap-3'>
                                        <View className='h-8 w-8 items-center justify-center rounded-xl bg-success-50'>
                                            <MaterialCommunityIcons name={item.icon as any} size={16} color='#16A34A' />
                                        </View>
                                        <Text className='flex-1 text-sm text-neutral-700'>{item.text}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                Price breakdown
                            </Text>
                            <View className='mt-2'>
                                <PriceRow label='Base price' amount={plan.price} />
                                <View className='border-b border-neutral-100' />
                                <PriceRow label='Security deposit (refundable)' amount={plan.deposit} />
                                <View className='border-b border-neutral-100' />
                                <PriceRow label='GST (18%)' amount={plan.gst} />
                                <View className='border-b border-neutral-100' />
                                <PriceRow label='Registration fee' amount={plan.registrationFee} />
                                <View className='my-1 border-b border-dashed border-neutral-200' />
                                <PriceRow label='Total payable' amount={plan.totalAmount} highlight />
                            </View>
                        </View>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                How it works
                            </Text>
                            <View className='mt-4 gap-3.5'>
                                {[
                                    { step: '1', text: 'Confirm your plan and complete booking' },
                                    { step: '2', text: 'Admin assigns a vehicle & battery to you' },
                                    { step: '3', text: 'Visit the station with your pickup OTP' },
                                    { step: '4', text: 'Ride and swap batteries anytime at any hub' },
                                ].map((item) => (
                                    <View key={item.step} className='flex-row items-center gap-3'>
                                        <View className='h-7 w-7 items-center justify-center rounded-full bg-primary-600'>
                                            <Text className='text-xs font-bold text-white'>{item.step}</Text>
                                        </View>
                                        <Text className='flex-1 text-sm text-neutral-700'>{item.text}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                    </View>
                </ScrollView>

                <View className='absolute bottom-0 left-0 right-0 border-t border-neutral-100 bg-white px-4 pb-8 pt-4'>
                    <View className='flex-row items-center justify-between'>
                        <View>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                Total payable
                            </Text>
                            <Text className='mt-0.5 text-2xl font-bold text-neutral-900'>
                                {formatCurrencyIN(plan.totalAmount)}
                            </Text>
                        </View>
                        <Button
                            label='Book This Plan'
                            onPress={handleSelectPlan}
                            className='h-12 rounded-xl bg-primary-600 px-8'
                            textClassName='text-base font-semibold text-white'
                        />
                    </View>
                </View>
            </View>
        </>
    )
}
