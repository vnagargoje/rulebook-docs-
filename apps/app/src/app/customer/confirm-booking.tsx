import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner-native'

import { SummaryRow } from '@/components/customer/confirm-booking'
import { Button, ScreenLoader, ScrollView, Text, View } from '@/components/ui'
import { formatCurrencyIN, formatNumberIN } from '@/lib/formatters/customer'
import { usePlanById } from '@/queries/customer'
import { usePurchasePlan } from '@/queries/customer'

export default function ConfirmBookingScreen() {
    const { planId } = useLocalSearchParams<{ planId: string }>()
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: plan, isLoading } = usePlanById({ variables: { id: planId! } })
    const purchaseMutation = usePurchasePlan()

    const handleConfirm = useCallback(() => {
        if (!planId) return

        purchaseMutation.mutate(
            { planId },
            {
                onSuccess: (userPlan) => {
                    queryClient.invalidateQueries({ queryKey: ['user-plans'] })
                    toast.success('Booking confirmed!', {
                        description: `${plan?.name} plan booked successfully.`,
                    })
                    router.replace({
                        pathname: '/customer/booking-success',
                        params: { userPlanId: userPlan.id },
                    })
                },
                onError: () => {
                    toast.error('Booking failed', {
                        description: 'Something went wrong. Please try again.',
                    })
                },
            },
        )
    }, [planId, plan, purchaseMutation, queryClient, router])

    const isPending = purchaseMutation.isPending

    if (isLoading || !plan) {
        return <ScreenLoader />
    }

    return (
        <View className='flex-1 bg-background'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 140 }}>
                <View className='gap-5'>
                    <View className='gap-1 py-2'>
                        <Text className='text-2xl font-bold text-neutral-900'>Confirm your booking</Text>
                        <Text className='text-sm leading-5 text-neutral-500'>
                            Review the plan details below and confirm to proceed
                        </Text>
                    </View>

                    <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                        <View className='flex-row items-start justify-between'>
                            <View className='flex-1 pr-3'>
                                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                    Selected Plan
                                </Text>
                                <Text className='mt-1 text-xl font-bold text-neutral-900'>{plan.name}</Text>
                            </View>
                            <View className='rounded-full bg-primary-50 border border-primary-100 px-3 py-1'>
                                <Text className='text-xs font-bold text-primary-600'>Selected</Text>
                            </View>
                        </View>
                        <View className='mt-4 flex-row'>
                            <View className='flex-1 items-center border-r border-neutral-100 py-3'>
                                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                    Validity
                                </Text>
                                <Text className='mt-1 text-base font-bold text-neutral-900'>
                                    {plan.validityDays} days
                                </Text>
                            </View>
                            <View className='flex-1 items-center border-r border-neutral-100 py-3'>
                                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                    KM Limit
                                </Text>
                                <Text className='mt-1 text-base font-bold text-neutral-900'>
                                    {formatNumberIN(plan.kmLimit)}
                                </Text>
                            </View>
                            <View className='flex-1 items-center py-3'>
                                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                    Swaps
                                </Text>
                                <Text className='mt-1 text-base font-bold text-neutral-900'>Unlimited</Text>
                            </View>
                        </View>
                    </View>

                    <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                        <Text className='text-xs font-bold uppercase tracking-[1.4px] text-neutral-400'>
                            Payment Summary
                        </Text>
                        <View className='mt-2'>
                            <SummaryRow
                                label='Base price'
                                value={formatCurrencyIN(plan.price)}
                            />
                            <View className='border-b border-neutral-100' />
                            <SummaryRow
                                label='Security deposit (refundable)'
                                value={formatCurrencyIN(plan.deposit)}
                            />
                            <View className='border-b border-neutral-100' />
                            <SummaryRow
                                label='GST'
                                value={formatCurrencyIN(plan.gst)}
                            />
                            <View className='border-b border-neutral-100' />
                            <SummaryRow
                                label='Registration fee'
                                value={formatCurrencyIN(plan.registrationFee)}
                            />
                            <View className='my-1 border-b border-dashed border-neutral-200' />
                            <SummaryRow
                                label='Total'
                                value={formatCurrencyIN(plan.totalAmount)}
                                bold
                            />
                        </View>
                    </View>

                    <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                        <Text className='text-xs font-bold uppercase tracking-[1.4px] text-neutral-500'>
                            What happens next
                        </Text>
                        <View className='mt-4 gap-3.5'>
                            {[
                                { icon: 'check-circle-outline', text: 'Booking is confirmed instantly' },
                                { icon: 'account-check-outline', text: 'System admin assigns vehicle & battery' },
                                { icon: 'numeric', text: 'You receive a pickup OTP' },
                                { icon: 'motorbike-electric', text: 'Visit station and start riding' },
                            ].map((item) => (
                                <View
                                    key={item.text}
                                    className='flex-row items-center gap-3'>
                                    <MaterialCommunityIcons
                                        name={item.icon as any}
                                        size={18}
                                        color='#6B7280'
                                    />
                                    <Text className='flex-1 text-sm text-neutral-600'>{item.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View className='absolute bottom-0 left-0 right-0 border-t border-neutral-100 bg-white px-4 pb-8 pt-4'>
                <Button
                    label={isPending ? 'Booking...' : 'Confirm Booking'}
                    onPress={handleConfirm}
                    loading={isPending}
                    disabled={isPending}
                    className='h-14 rounded-2xl bg-primary-600'
                    textClassName='text-base font-semibold text-white'
                />
                <Text className='mt-3 text-center text-xs text-neutral-400'>
                    Payment integration coming soon. Booking is free for now.
                </Text>
            </View>
        </View>
    )
}
