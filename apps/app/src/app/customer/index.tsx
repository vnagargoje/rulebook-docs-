import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { useWindowDimensions } from 'react-native'
import { SectionHeading } from '@/components/section-heading'
import { CustomerHeroCard } from '@/components/customer/customer-hero-card'
import { CustomerQuickActionCard } from '@/components/customer/customer-quick-action-card'
import { CustomerRideStatCard } from '@/components/customer/customer-ride-stat-card'
import { CustomerStationCard } from '@/components/customer/customer-station-card'
import { customerHomeContent, customerHomeQuickActions, customerHomeRideStats, customerHomeStations } from '@/data/customer/customer-home.data'
import { Button, FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'

export default function CustomerHomeScreen() {
    const router = useRouter()
    const { width } = useWindowDimensions()
    const quickActionWidth = width < 360 ? '100%' : '48%'
    const rideStatWidth = width < 428 ? '100%' : '31%'

    const handleBookingPress = useCallback(() => {
        router.push('/customer/booking')
    }, [router])

    const handleSupportPress = useCallback(() => {
        router.push('/customer/support')
    }, [router])

    const handleSettingsPress = useCallback(() => {
        router.push('/customer/settings')
    }, [router])

    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-8'>
                        <SectionHeading {...customerHomeContent.heading} />

                        <CustomerHeroCard
                            {...customerHomeContent.hero}
                            onPrimaryPress={handleBookingPress}
                            onSecondaryPress={handleSupportPress}
                        />

                        <View className='gap-4'>
                            <SectionHeading {...customerHomeContent.quickActionsSection} />
                            <View className='flex-row flex-wrap justify-between gap-y-4'>
                                {customerHomeQuickActions.map((action) => (
                                    <CustomerQuickActionCard
                                        key={action.id}
                                        action={action}
                                        width={quickActionWidth}
                                    />
                                ))}
                            </View>
                        </View>

                        <View className='gap-4'>
                            <SectionHeading
                                eyebrow={customerHomeContent.rideSection.eyebrow}
                                title={customerHomeContent.rideSection.title}
                                description={customerHomeContent.rideSection.description}
                            />
                            <View className='rounded-[28px] bg-[#0F172A] p-5'>
                                <View className='flex-row items-start justify-between gap-4'>
                                    <View className='flex-1 gap-2'>
                                        <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-[#8EA0BE]'>
                                            {customerHomeContent.rideSection.routeLabel}
                                        </Text>
                                        <Text className='text-2xl font-bold text-white'>
                                            {customerHomeContent.rideSection.routeTitle}
                                        </Text>
                                        <Text className='text-sm leading-6 text-[#CBD5E1]'>
                                            {customerHomeContent.rideSection.routeDescription}
                                        </Text>
                                    </View>
                                    <View className='rounded-full bg-white/10 px-3 py-1'>
                                        <Text className='text-xs font-semibold text-white'>
                                            {customerHomeContent.rideSection.statusLabel}
                                        </Text>
                                    </View>
                                </View>

                                <View className='mt-5 flex-row flex-wrap gap-3'>
                                    {customerHomeRideStats.map((stat) => (
                                        <CustomerRideStatCard
                                            key={stat.id}
                                            stat={stat}
                                            width={rideStatWidth}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View className='gap-4'>
                            <SectionHeading {...customerHomeContent.stationSection} />
                            <View className='gap-3'>
                                {customerHomeStations.map((station) => (
                                    <CustomerStationCard
                                        key={station.id}
                                        station={station}
                                    />
                                ))}
                            </View>
                        </View>

                        <View className='rounded-[28px] border border-primary-100 bg-primary-50 p-5'>
                            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-primary-700'>
                                {customerHomeContent.profileCard.eyebrow}
                            </Text>
                            <Text className='mt-3 text-2xl font-bold text-neutral-900'>
                                {customerHomeContent.profileCard.title}
                            </Text>
                            <Text className='mt-3 text-sm leading-6 text-neutral-600'>
                                {customerHomeContent.profileCard.description}
                            </Text>
                            <Button
                                label={customerHomeContent.profileCard.actionLabel}
                                onPress={handleSettingsPress}
                                className='mt-5 h-12 rounded-xl bg-primary-500'
                                textClassName='text-base font-semibold text-white'
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
