import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import RazorpayCheckout from 'react-native-razorpay'
import type { PaymentSuccessData, PaymentErrorData } from 'react-native-razorpay/src/types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { StatTile } from '@/components/customer/shared'

import { Button, Pressable, ScreenLoader, ScrollView, Text, View } from '@/components/ui'
import { formatCurrencyIN, formatKmIN, formatNumberIN, formatPercentage, getAmountDifference } from '@/lib/formatters/customer'
import { useInitiateTopUpPurchase, useVerifyTopUpPayment, useTopUpById } from '@/queries/customer'
import { useMyPlans } from '@/queries/customer'
import { useCustomerProfile } from '@/queries/customer'

export default function ConfirmTopUpScreen() {
    const { topUpId } = useLocalSearchParams<{ topUpId: string }>()
    const router = useRouter()
    const queryClient = useQueryClient()
    const insets = useSafeAreaInsets()

    const { data: topUp, isLoading: topUpLoading } = useTopUpById({
        variables: topUpId ? { id: topUpId } : undefined,
        enabled: Boolean(topUpId),
    })
    const { data: myPlansData, isLoading: plansLoading } = useMyPlans({ variables: { status: 'active' } })
    const { data: profile } = useCustomerProfile()
    const initiateTopUpPurchase = useInitiateTopUpPurchase()
    const verifyTopUpPayment = useVerifyTopUpPayment()

    const activePlans = myPlansData?.data ?? []

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

    const resolvedPlanId = selectedPlanId ?? (activePlans.length === 1 ? activePlans[0].id : null)
    const canProceed = Boolean(topUpId) && Boolean(resolvedPlanId)
    const isPending = initiateTopUpPurchase.isPending || verifyTopUpPayment.isPending
    const isRazorpayOpen = useRef(false)
    const gstAmount = topUp ? getAmountDifference(topUp.totalAmount, topUp.price) : 0

    const handleConfirm = useCallback(() => {
        const userPlanId = resolvedPlanId
        if (!topUpId || !userPlanId) {
            toast.error('Please select an active plan to continue')
            return
        }

        // Step 1: create a Razorpay order on the backend
        initiateTopUpPurchase.mutate(
            { topUpId, userPlanId },
            {
                onSuccess: async (orderData) => {
                    const options = {
                        description: `${topUp?.name ?? 'Top-Up'} - Yugo`,
                        currency: orderData.currency,
                        key: orderData.key,
                        amount: orderData.amount,
                        name: 'Yugo',
                        order_id: orderData.razorpayOrderId,
                        prefill: {
                            name: [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || undefined,
                            email: profile?.email ?? undefined,
                            contact: profile?.mobilenumber ?? undefined,
                        },
                        theme: { color: '#22C55E' },
                        modal: { confirm_close: true },
                    }

                    try {
                        // Step 2: open Razorpay checkout UI
                        isRazorpayOpen.current = true
                        const paymentData: PaymentSuccessData = await RazorpayCheckout.open(options)
                        isRazorpayOpen.current = false

                        // Guard: empty/missing signature must never reach the server
                        if (!paymentData.razorpay_signature) {
                            toast.error('Payment error', { description: 'Signature missing from payment response. Please try again.' })
                            return
                        }

                        // Step 3: verify signature server-side and apply top-up
                        verifyTopUpPayment.mutate(
                            {
                                razorpayOrderId: paymentData.razorpay_order_id ?? orderData.razorpayOrderId,
                                razorpayPaymentId: paymentData.razorpay_payment_id,
                                razorpaySignature: paymentData.razorpay_signature,
                                topUpId,
                                userPlanId,
                            },
                            {
                                onSuccess: () => {
                                    queryClient.invalidateQueries({ queryKey: ['user-plans'] })
                                    queryClient.invalidateQueries({ queryKey: ['bookings'] })
                                    queryClient.invalidateQueries({ queryKey: ['transactions'] })
                                    toast.success('Top-up successful!', {
                                        description: `${topUp?.name} has been added to your plan.`,
                                    })
                                    router.replace({
                                        pathname: '/customer/topup-success',
                                        params: { topUpId, userPlanId },
                                    })
                                },
                                onError: (error: any) => {
                                    // If webhook beat us to it, payment still succeeded
                                    if (error?.data?.code === 'PAYMENT_ALREADY_PROCESSED') {
                                        queryClient.invalidateQueries({ queryKey: ['user-plans'] })
                                        queryClient.invalidateQueries({ queryKey: ['transactions'] })
                                        router.replace({
                                            pathname: '/customer/topup-success',
                                            params: { topUpId, userPlanId },
                                        })
                                    } else {
                                        toast.error('Verification failed', {
                                            description: error?.message ?? 'Something went wrong. Please try again.',
                                        })
                                    }
                                },
                            },
                        )
                    } catch (error) {
                        isRazorpayOpen.current = false
                        const razorpayError = error as PaymentErrorData
                        if (razorpayError?.code === 2) {
                            toast.error('Payment cancelled', {
                                description: 'You cancelled the payment. Try again anytime.',
                            })
                        } else {
                            toast.error('Payment failed', {
                                description: razorpayError?.description ?? 'Something went wrong. Please try again.',
                            })
                        }
                    }
                },
            },
        )
    }, [topUpId, resolvedPlanId, topUp, profile, initiateTopUpPurchase, verifyTopUpPayment, queryClient, router])

    if (topUpLoading || plansLoading) {
        return <ScreenLoader />
    }

    if (!topUp) {
        return (
            <View className='flex-1 items-center justify-center bg-white'>
                <MaterialCommunityIcons
                    name='alert-circle-outline'
                    size={48}
                    color='#EF4444'
                />
                <Text className='mt-4 text-lg font-semibold text-neutral-900'>Top-up not found</Text>
                <Button
                    label='Go Back'
                    onPress={() => router.back()}
                    className='mt-4 bg-primary-600 px-8'
                    textClassName='text-white font-semibold'
                />
            </View>
        )
    }

    return (
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
                                        <MaterialCommunityIcons
                                            name='information-outline'
                                            size={13}
                                            color='#9CA3AF'
                                        />
                                        <Text className='flex-1 text-sm text-neutral-500'>{topUp.description}</Text>
                                    </View>
                                ) : null}
                            </View>
                            <View className='items-end'>
                                <Text className='text-xl font-bold text-primary-600'>
                                    {formatCurrencyIN(topUp.totalAmount)}
                                </Text>
                                <Text className='text-[10px] text-neutral-400'>incl. GST</Text>
                            </View>
                        </View>

                        <View className='mt-4 flex-row gap-3'>
                            <StatTile
                                label='KM Added'
                                value={`+${formatNumberIN(topUp.kmLimit)} km`}
                                tint='success'
                            />
                            <StatTile
                                label='Base Price'
                                value={formatCurrencyIN(topUp.price)}
                            />
                            <StatTile
                                label={`GST (${formatPercentage(topUp.gstPercentage)})`}
                                value={formatCurrencyIN(gstAmount)}
                                tint='primary'
                            />
                        </View>
                    </View>

                    <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                            Apply to Plan
                        </Text>
                        <Text className='mt-1 text-base font-bold text-neutral-900'>Select your active plan</Text>

                        {activePlans.length === 0 ? (
                            <View className='mt-4 items-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 py-8'>
                                <MaterialCommunityIcons
                                    name='alert-circle-outline'
                                    size={40}
                                    color='#D1D5DB'
                                />
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
                                    const isSelected =
                                        (selectedPlanId ?? (activePlans.length === 1 ? activePlans[0].id : null)) ===
                                        plan.id
                                    return (
                                        <Pressable
                                            key={plan.id}
                                            onPress={() => setSelectedPlanId(plan.id)}>
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
                                <Text className='text-sm text-neutral-500'>GST ({formatPercentage(topUp.gstPercentage)})</Text>
                                <Text className='text-sm font-medium text-neutral-900'>
                                    {formatCurrencyIN(gstAmount)}
                                </Text>
                            </View>
                            <View className='border-b border-neutral-100' />
                            <View className='flex-row items-center justify-between pt-3'>
                                <Text className='text-base font-bold text-neutral-900'>Total</Text>
                                <Text className='text-base font-bold text-primary-600'>
                                    {formatCurrencyIN(topUp.totalAmount)}
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
                                    <MaterialCommunityIcons
                                        name='check'
                                        size={14}
                                        color='#16A34A'
                                    />
                                </View>
                                <Text className='text-sm text-neutral-700'>
                                    +{formatKmIN(topUp.kmLimit).replace(' km', '')} km added instantly
                                </Text>
                            </View>
                            <View className='flex-row items-center gap-3'>
                                <View className='h-7 w-7 items-center justify-center rounded-xl bg-success-50'>
                                    <MaterialCommunityIcons
                                        name='check'
                                        size={14}
                                        color='#16A34A'
                                    />
                                </View>
                                <Text className='text-sm text-neutral-700'>Changes apply instantly</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View
                style={{ paddingBottom: Math.max(insets.bottom, 16) + 12 }}
                className='absolute bottom-0 left-0 right-0 border-t border-neutral-100 bg-white px-4 pt-4'>
                <Button
                    label={
                        initiateTopUpPurchase.isPending
                            ? 'Creating order...'
                            : verifyTopUpPayment.isPending
                              ? 'Verifying payment...'
                              : 'Confirm Top-Up'
                    }
                    onPress={handleConfirm}
                    disabled={!canProceed || isPending || isRazorpayOpen.current}
                    className={`h-14 rounded-2xl ${canProceed ? 'bg-primary-600' : 'bg-neutral-300'}`}
                    textClassName='text-base font-semibold text-white'
                />
            </View>
        </View>
    )
}
