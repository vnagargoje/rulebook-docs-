import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { FlatList, RefreshControl } from 'react-native'

import { StationCard } from '@/components/customer/select-station'
import { ActivityIndicator, Button, Text, View } from '@/components/ui'
import { useStations } from '@/queries/customer'

export default function SelectStationScreen() {
    const { planId } = useLocalSearchParams<{ planId: string }>()
    const router = useRouter()
    const { data, isLoading, refetch, isRefetching } = useStations()
    const [selectedStationId, setSelectedStationId] = useState<string | null>(null)

    const stations = data?.data ?? []

    const handleSelect = useCallback((stationId: string) => {
        setSelectedStationId(stationId)
    }, [])

    const handleContinue = useCallback(() => {
        if (!selectedStationId) return
        router.push({
            pathname: '/customer/confirm-booking',
            params: { planId, stationId: selectedStationId },
        })
    }, [router, planId, selectedStationId])

    return (
        <View className='flex-1 bg-background'>
            <FlatList
                data={stations}
                keyExtractor={(item: any, index) => item?.id ?? `station-${index}`}
                renderItem={({ item }) => {
                    if (!item?.id) return null
                    return (
                        <StationCard
                            station={item}
                            isSelected={selectedStationId === item.id}
                            onSelect={() => handleSelect(item.id)}
                        />
                    )
                }}
                ItemSeparatorComponent={() => <View className='h-3' />}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                    />
                }
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 120 }}
                ListHeaderComponent={
                    <View className='gap-5 pb-5'>
                        <View className='rounded-3xl bg-neutral-900 p-5'>
                            <View className='flex-row items-center gap-3'>
                                <View className='rounded-2xl bg-white/10 p-3'>
                                    <MaterialCommunityIcons
                                        name='map-marker-radius-outline'
                                        size={22}
                                        color='#FFF'
                                    />
                                </View>
                                <View className='flex-1'>
                                    <Text className='text-base font-semibold text-white'>Pick your station</Text>
                                    <Text className='mt-1 text-sm text-neutral-400'>
                                        This is where you&apos;ll pick up your vehicle
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    isLoading ? (
                        <View className='items-center py-12'>
                            <ActivityIndicator size='large' />
                            <Text className='mt-3 text-sm text-neutral-500'>Finding stations near you...</Text>
                        </View>
                    ) : (
                        <View className='items-center rounded-3xl border border-neutral-200 bg-white py-12'>
                            <MaterialCommunityIcons
                                name='map-marker-off-outline'
                                size={48}
                                color='#D1D5DB'
                            />
                            <Text className='mt-4 text-lg font-semibold text-neutral-900'>No stations available</Text>
                            <Text className='mt-2 text-sm text-neutral-500'>Check back later</Text>
                        </View>
                    )
                }
            />

            {selectedStationId && (
                <View className='absolute bottom-0 left-0 right-0 border-t border-neutral-100 bg-white px-4 pb-8 pt-4'>
                    <Button
                        label='Continue'
                        onPress={handleContinue}
                        className='h-14 rounded-xl bg-primary-600'
                        textClassName='text-base font-semibold text-white'
                    />
                </View>
            )}
        </View>
    )
}
