import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button, ScrollView, Text, View } from '@/components/ui'

export default function BookingSuccessScreen() {
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const handleViewBookings = useCallback(() => {
        router.replace('/customer/(tabs)/bookings')
    }, [router])

    const handleGoHome = useCallback(() => {
        router.replace('/customer/(tabs)')
    }, [router])

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 32 }}
                showsVerticalScrollIndicator={false}
            >

                <View className='items-center'>
                    <View className='h-36 w-36 items-center justify-center rounded-full bg-success-500/10'>
                        <View className='h-28 w-28 items-center justify-center rounded-full bg-success-500/20'>
                            <View className='h-20 w-20 items-center justify-center rounded-full bg-success-500'>
                                <MaterialCommunityIcons name='check' size={40} color='#FFF' />
                            </View>
                        </View>
                    </View>

                    <Text className='mt-8 text-center text-3xl font-bold text-neutral-900'>
                        Booking Confirmed!
                    </Text>
                    <Text className='mt-3 text-center text-base leading-6 text-neutral-500'>
                        Your plan has been booked successfully.{'\n'}Here&apos;s what happens next:
                    </Text>
                </View>


                <View className='mt-10 rounded-3xl bg-neutral-50 p-5'>
                    {[
                        {
                            step: '1',
                            icon: 'account-check' as const,
                            color: '#2563EB',
                            bg: '#EFF6FF',
                            title: 'Vehicle assignment',
                            subtitle: 'Admin will assign a vehicle & battery to your booking',
                        },
                        {
                            step: '2',
                            icon: 'shield-key' as const,
                            color: '#D97706',
                            bg: '#FFFBEB',
                            title: 'Get your pickup OTP',
                            subtitle: 'Show this OTP at the station to collect your vehicle',
                        },
                        {
                            step: '3',
                            icon: 'motorbike-electric' as const,
                            color: '#16A34A',
                            bg: '#F0FDF4',
                            title: 'Start riding!',
                            subtitle: 'Swap batteries at any Yugo hub anytime',
                        },
                    ].map((step, index) => (
                        <View key={step.title} className='flex-row gap-4'>

                            <View className='items-center'>
                                <View
                                    style={{ backgroundColor: step.bg }}
                                    className='h-12 w-12 items-center justify-center rounded-full'
                                >
                                    <MaterialCommunityIcons name={step.icon} size={22} color={step.color} />
                                </View>
                                {index < 2 && <View className='my-1 h-6 w-0.5 bg-neutral-200' />}
                            </View>

                            <View className='flex-1 justify-center pb-4'>
                                <Text className='text-base font-semibold text-neutral-900'>{step.title}</Text>
                                <Text className='mt-0.5 text-sm leading-5 text-neutral-500'>{step.subtitle}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Buttons */}
                <View className='mt-10 gap-3'>
                    <Button
                        label='View My Bookings'
                        onPress={handleViewBookings}
                        className='h-14 rounded-2xl bg-primary-600'
                        textClassName='text-base font-semibold text-white'
                    />
                    <Button
                        label='Go to Home'
                        onPress={handleGoHome}
                        variant='outline'
                        className='h-14 rounded-2xl border-neutral-200'
                        textClassName='text-base font-semibold text-neutral-700'
                    />
                </View>
            </ScrollView>
        </View>
    )
}
