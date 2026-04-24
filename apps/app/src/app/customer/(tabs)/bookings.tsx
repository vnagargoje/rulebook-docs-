import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { FlatList, RefreshControl } from 'react-native'

import { BookingCard } from '@/components/customer/bookings'
import { TabButton } from '@/components/customer/shared'
import { SectionHeading } from '@/components/section-heading'
import { ActivityIndicator, Button, FocusAwareStatusBar, SafeAreaView, Text, View } from '@/components/ui'
import { useBookings } from '@/queries/customer'

type TabKey = 'upcoming' | 'completed'

export default function BookingsScreen() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<TabKey>('upcoming')

    const { data, isLoading, refetch, isRefetching } = useBookings({
        variables: { status: activeTab === 'upcoming' ? ['created', 'ongoing', 'draft'] : ['completed', 'cancelled', 'inactive'] },
    })

    const bookings = data?.data ?? []
    const handleBookingPress = useCallback(
        (bookingId: string) => {
            router.push({ pathname: '/customer/booking/[id]', params: { id: bookingId } })
        },
        [router],
    )

    const handleNewBooking = useCallback(() => {
        router.push('/customer/(tabs)/plans')
    }, [router])

    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <FlatList
                    data={bookings}
                    key={activeTab}
                    keyExtractor={(item: any, index) => item?.id ?? `${activeTab}-${index}`}
                    renderItem={({ item }) => {
                        if (!item?.id) return null
                        return (
                            <BookingCard
                                booking={item}
                                onPress={() => handleBookingPress(item.id)}
                            />
                        )
                    }}
                    ItemSeparatorComponent={() => <View className='h-3' />}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
                    ListHeaderComponent={(
                        <View className='gap-6 pb-6'>
                        <SectionHeading
                            eyebrow='Bookings'
                            title='Your ride bookings'
                            description='Track upcoming and past bookings in one place.'
                        />

                        <View className='flex-row rounded-2xl bg-neutral-100 p-1'>
                            <TabButton
                                label='Upcoming'
                                isActive={activeTab === 'upcoming'}
                                onPress={() => setActiveTab('upcoming')}
                            />
                            <TabButton
                                label='Completed'
                                isActive={activeTab === 'completed'}
                                onPress={() => setActiveTab('completed')}
                            />
                        </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        isLoading ? (
                            <View className='items-center py-12'>
                                <ActivityIndicator size='large' />
                                <Text className='mt-3 text-sm text-neutral-500'>Loading bookings...</Text>
                            </View>
                        ) : (
                            <View className='items-center rounded-3xl border border-neutral-200 bg-white py-12'>
                                <MaterialCommunityIcons
                                    name={activeTab === 'upcoming' ? 'calendar-blank-outline' : 'calendar-check'}
                                    size={48}
                                    color='#D1D5DB'
                                />
                                <Text className='mt-4 text-lg font-semibold text-neutral-900'>
                                    {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No completed bookings'}
                                </Text>
                                <Text className='mt-2 text-sm text-neutral-500'>
                                    {activeTab === 'upcoming'
                                        ? 'Book a plan to get started'
                                        : 'Completed rides will appear here'}
                                </Text>
                                {activeTab === 'upcoming' && (
                                    <Button
                                        label='Browse Plans'
                                        onPress={handleNewBooking}
                                        className='mt-5 h-10 rounded-xl bg-primary-600 px-6'
                                        textClassName='text-sm font-semibold text-white'
                                    />
                                )}
                            </View>
                        )
                    }
                />
            </SafeAreaView>
        </>
    )
}
