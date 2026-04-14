import { useRouter } from 'expo-router'
import * as React from 'react'
import { useWindowDimensions } from 'react-native'
import { Button, FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { HeroCard } from './components/hero-card'
import { QuickActionCard } from './components/quick-action-card'
import { RideStatCard } from './components/ride-stat-card'
import { SectionHeading } from './components/section-heading'
import { StationCard } from './components/station-card'
import { homeQuickActions, homeRideStats, homeStations } from './home.data'

export function HomeScreen() {
    const router = useRouter()
    const { width } = useWindowDimensions()
    const quickActionWidth = width < 360 ? '100%' : '48%'
    const rideStatWidth = width < 428 ? '100%' : '31%'

    const handleSettingsPress = React.useCallback( () => {
        router.push( '/settings' )
    }, [ router ] )

    const handleStylePress = React.useCallback( () => {
        router.push( '/style' )
    }, [ router ] )

    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-8'>
                        <SectionHeading
                            eyebrow='Home'
                            title='Your Yugo ride at a glance'
                            description='A focused first screen for bookings, battery swaps, and daily ride progress.'
                        />

                        <HeroCard
                            onPrimaryPress={handleSettingsPress}
                            onSecondaryPress={handleStylePress}
                        />

                        <View className='gap-4'>
                            <SectionHeading
                                eyebrow='Quick actions'
                                title='Everything you need before the next ride'
                            />
                            <View className='flex-row flex-wrap justify-between gap-y-4'>
                                {homeQuickActions.map( ( action ) => (
                                    <QuickActionCard
                                        key={action.id}
                                        action={action}
                                        width={quickActionWidth}
                                    />
                                ) )}
                            </View>
                        </View>

                        <View className='gap-4'>
                            <SectionHeading
                                eyebrow='Active ride'
                                title='Live booking snapshot'
                                description='Show the most important ride information without making the user hunt through tabs.'
                            />
                            <View className='rounded-[28px] bg-[#0F172A] p-5'>
                                <View className='flex-row items-start justify-between gap-4'>
                                    <View className='flex-1 gap-2'>
                                        <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-[#8EA0BE]'>
                                            Ride in progress
                                        </Text>
                                        <Text className='text-2xl font-bold text-white'>Bellandur to HSR Layout</Text>
                                        <Text className='text-sm leading-6 text-[#CBD5E1]'>
                                            Vehicle YG-204 is assigned and the next recommended swap is 6 minutes away.
                                        </Text>
                                    </View>
                                    <View className='rounded-full bg-white/10 px-3 py-1'>
                                        <Text className='text-xs font-semibold text-white'>On route</Text>
                                    </View>
                                </View>

                                <View className='mt-5 flex-row flex-wrap gap-3'>
                                    {homeRideStats.map( ( stat ) => (
                                        <RideStatCard
                                            key={stat.id}
                                            stat={stat}
                                            width={rideStatWidth}
                                        />
                                    ) )}
                                </View>
                            </View>
                        </View>

                        <View className='gap-4'>
                            <SectionHeading
                                eyebrow='Nearby stations'
                                title='Swap points close to your route'
                            />
                            <View className='gap-3'>
                                {homeStations.map( ( station ) => (
                                    <StationCard
                                        key={station.id}
                                        station={station}
                                    />
                                ) )}
                            </View>
                        </View>

                        <View className='rounded-[28px] border border-primary-100 bg-primary-50 p-5 dark:border-primary-900/40 dark:bg-primary-900/10'>
                            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-primary-700 dark:text-primary-300'>
                                Support and safety
                            </Text>
                            <Text className='mt-3 text-2xl font-bold text-neutral-900 dark:text-neutral-50'>
                                Keep KYC, payment, and pickup details within easy reach.
                            </Text>
                            <Text className='mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300'>
                                This layout is designed to surface the next step quickly, whether the user is choosing a plan or riding toward the nearest swap station.
                            </Text>
                            <Button
                                label='Review account settings'
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
