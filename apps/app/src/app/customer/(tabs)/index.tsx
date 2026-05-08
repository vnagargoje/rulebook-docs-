import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo } from 'react'
import { FlatList, RefreshControl } from 'react-native'

import { ActiveBookingCard, ActivePlanCard, GetStartedCard, QuickPlanCard } from '@/components/customer/home'
import { Pressable, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { useBookings } from '@/queries/customer'
import { usePlans } from '@/queries/customer'
import { useMyPlans } from '@/queries/customer'
import { getFullKycRoute, isFullKycComplete, useKycStatus } from '@/queries/customer/kyc.query'
import { useMyProfile } from '@/queries/profile'
import { useAuthStore } from '@/stores/auth.store'

export default function CustomerHomeScreen() {
    const router = useRouter()
    const token = useAuthStore.use.token()
    const isLoggedIn = Boolean(token?.access)

    const { data: plansData, isLoading: plansLoading, refetch: refetchPlans } = usePlans()
    const {
        data: bookingsData,
        isLoading: bookingsLoading,
        refetch: refetchBookings,
    } = useBookings({ variables: { status: ['created', 'ongoing'] }, enabled: isLoggedIn })
    const { data: myPlansData, refetch: refetchMyPlans } = useMyPlans({
        variables: { status: 'active' },
        enabled: isLoggedIn,
    })

    const { data: kycStatus, isFetched: kycFetched } = useKycStatus({ enabled: isLoggedIn })
    const { data: profile, isFetched: profileFetched } = useMyProfile({ enabled: isLoggedIn })

    // On reload: if KYC second-phase (profile/address/emergency) is incomplete, redirect
    useEffect(() => {
        if (!isLoggedIn || !kycFetched || !profileFetched) return
        if (!isFullKycComplete(kycStatus, profile)) {
            const route = getFullKycRoute(kycStatus, profile)
            if (route !== '/customer') {
                router.replace(route as any)
            }
        }
    }, [isLoggedIn, kycFetched, profileFetched, kycStatus, profile, router])

    const plans = plansData?.data ?? []
    const activeBooking = bookingsData?.data?.[0]
    const activePlan = myPlansData?.data?.[0]

    const greeting = useMemo(() => {
        const h = new Date().getHours()
        if (h < 12) return 'Good morning'
        if (h < 17) return 'Good afternoon'
        return 'Good evening'
    }, [])

    const handleRefresh = useCallback(() => {
        refetchPlans()
        if (isLoggedIn) {
            refetchBookings()
            refetchMyPlans()
        }
    }, [isLoggedIn, refetchPlans, refetchBookings, refetchMyPlans])

    const handleBrowsePlans = useCallback(() => router.push('/customer/(tabs)/plans'), [router])

    const handleRecharge = useCallback(
        () =>
            router.push({
                pathname: '/customer/(tabs)/plans',
                params: { tab: 'topups' },
            }),
        [router],
    )

    const handleBookingPress = useCallback(
        (id: string) => router.push({ pathname: '/customer/booking/[id]', params: { id } }),
        [router],
    )

    const handlePlanPress = useCallback(
        (id: string) => router.push({ pathname: '/customer/plan/[id]', params: { id } }),
        [router],
    )

    return (
        <SafeAreaView className='flex-1 bg-background'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={handleRefresh}
                    />
                }
                contentContainerStyle={{ paddingBottom: 40 }}>
                <View className='gap-6'>
                    <View className='flex-row items-center justify-between px-4 pt-4'>
                        <View>
                            <Text className='text-[11px] font-semibold uppercase tracking-[1.5px] text-neutral-400'>
                                {greeting}
                            </Text>
                            <Text className='mt-0.5 text-2xl font-bold text-neutral-900'>Your Dashboard</Text>
                        </View>
                    </View>

                    <View className='px-4'>
                        {activeBooking ? (
                            <ActiveBookingCard
                                booking={activeBooking}
                                onPress={() => handleBookingPress(activeBooking.id)}
                            />
                        ) : activePlan ? (
                            <ActivePlanCard
                                plan={activePlan}
                                onRecharge={handleRecharge}
                            />
                        ) : !bookingsLoading ? (
                            <GetStartedCard onPress={handleBrowsePlans} />
                        ) : null}
                    </View>

                    {activeBooking && activePlan && (
                        <View className='px-4'>
                            <ActivePlanCard
                                plan={activePlan}
                                onRecharge={handleRecharge}
                            />
                        </View>
                    )}

                    {!plansLoading && plans.length > 0 && (
                        <View className='gap-3'>
                            <View className='flex-row items-center justify-between px-4'>
                                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                    Available Plans
                                </Text>
                                <Pressable onPress={handleBrowsePlans}>
                                    <Text className='text-sm font-semibold text-primary-600'>See all</Text>
                                </Pressable>
                            </View>
                            <FlatList
                                horizontal
                                data={plans.slice(0, 5)}
                                keyExtractor={(item: any, index) => item?.id ?? `plan-${index}`}
                                renderItem={({ item }) => {
                                    if (!item?.id) return null
                                    return (
                                        <QuickPlanCard
                                            plan={item}
                                            onPress={() => handlePlanPress(item.id)}
                                        />
                                    )
                                }}
                                ItemSeparatorComponent={() => <View className='w-3' />}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
