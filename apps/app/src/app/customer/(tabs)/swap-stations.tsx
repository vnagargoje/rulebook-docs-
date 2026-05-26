import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { FlatList, RefreshControl } from 'react-native'

import { SwapStationCard } from '@/components/customer/swap-stations'
import { SectionHeading } from '@/components/section-heading'
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from '@/components/ui'
import { useSwapStations } from '@/queries/customer'

export default function SwapStationsScreen() {
    const router = useRouter()
    const {
        data,
        isLoading,
        refetch,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSwapStations()

    const stations = data?.pages.flatMap((page) => page.data) ?? []

    const handleStationPress = useCallback(
        (id: string) => {
            router.push({ pathname: '/customer/station/[id]', params: { id } })
        },
        [router],
    )

    const handleEndReached = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-background'>
            <FlatList
                data={stations}
                keyExtractor={(item: any, index) => item?.id ?? `station-${index}`}
                renderItem={({ item }) => {
                    if (!item?.id) return null
                    return (
                        <SwapStationCard
                            station={item}
                            onPress={() => handleStationPress(item.id)}
                        />
                    )
                }}
                ItemSeparatorComponent={() => <View className='h-3' />}
                showsVerticalScrollIndicator={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.4}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                    />
                }
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
                ListHeaderComponent={
                    <View className='gap-5 pb-4'>
                        <SectionHeading
                            eyebrow='Stations'
                            title='Swap Stations'
                            description='Find a battery swap station near you.'
                        />

                        <View className='overflow-hidden rounded-3xl bg-[#0B1220] p-5'>
                            <View className='absolute -right-8 -top-6 h-28 w-28 rounded-full bg-primary-500/20' />
                            <View className='absolute -left-6 bottom-6 h-20 w-20 rounded-full bg-cyan-400/10' />
                            <View className='flex-row items-center gap-3'>
                                <View className='h-12 w-12 items-center justify-center rounded-2xl bg-white/10'>
                                    <MaterialCommunityIcons
                                        name='lightning-bolt-circle'
                                        size={26}
                                        color='#60A5FA'
                                    />
                                </View>
                                <View className='flex-1'>
                                    <Text className='text-[11px] font-semibold uppercase tracking-[1.4px] text-[#8EA0BE]'>
                                        Battery Network
                                    </Text>
                                    <Text className='mt-0.5 text-base font-bold text-white'>
                                        Instant swaps, zero downtime
                                    </Text>
                                </View>
                            </View>
                            <Text className='mt-3 text-sm leading-6 text-[#C6D0E0]'>
                                Walk in with a drained battery and ride out fully charged — in under 60 seconds.
                            </Text>
                        </View>

                        {/* <TouchableOpacity
                            onPress={() => router.push('/customer/nearby-swap-stations')}
                            className='flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4'>
                            <View className='h-10 w-10 items-center justify-center rounded-xl bg-primary-50'>
                                <MaterialCommunityIcons
                                    name='map-marker-radius'
                                    size={20}
                                    color='#2563EB'
                                />
                            </View>
                            <View className='flex-1'>
                                <Text className='text-sm font-semibold text-neutral-900'>Nearby Me</Text>
                                <Text className='text-xs text-neutral-500'>
                                    View nearest stations on the map
                                </Text>
                            </View>
                            <MaterialCommunityIcons name='chevron-right' size={20} color='#9CA3AF' />
                        </TouchableOpacity> */}
                    </View>
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className='items-center py-6'>
                            <ActivityIndicator size='small' />
                            <Text className='mt-2 text-xs text-neutral-400'>Loading more stations...</Text>
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    isLoading ? (
                        <View className='items-center py-12'>
                            <ActivityIndicator size='large' />
                            <Text className='mt-3 text-sm text-neutral-500'>Finding stations...</Text>
                        </View>
                    ) : (
                        <View className='items-center rounded-3xl border border-neutral-200 bg-white py-12'>
                            <MaterialCommunityIcons
                                name='map-marker-off-outline'
                                size={48}
                                color='#D1D5DB'
                            />
                            <Text className='mt-4 text-lg font-semibold text-neutral-900'>
                                No swap stations found
                            </Text>
                            <Text className='mt-2 text-sm text-neutral-500'>
                                Check back soon as we expand our network
                            </Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    )
}
