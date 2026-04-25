import { useCallback } from 'react'
import { RefreshControl } from 'react-native'

import { ActionCard, InventoryStats, RecentActivityItem } from '@/components/swap-manager/home'
import { FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'

export default function () {
    const handleRefresh = useCallback(() => {
        // Mock refresh
    }, [])

    const handleExecuteSwap = useCallback(() => {
        // No action for now
    }, [])

    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-neutral-50' edges={['top']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
                    contentContainerStyle={{ paddingBottom: 40 }}>
                    <View className='gap-6'>
                        <View className='px-4 pt-4'>
                            <Text className='text-[11px] font-semibold uppercase tracking-[1.5px] text-neutral-400'>
                                Welcome Back, Manager
                            </Text>
                            <Text className='mt-0.5 text-2xl font-bold text-neutral-900'>Station Dashboard</Text>
                            <View className='mt-2 flex-row items-center gap-1.5'>
                                <View className='h-2 w-2 rounded-full bg-primary-500' />
                                <Text className='text-sm font-medium text-neutral-600'>HSR Layout Station #04</Text>
                            </View>
                        </View>

                        <View className='px-4'>
                            <ActionCard onPress={handleExecuteSwap} />
                        </View>

                        <View className='gap-3'>
                            <View className='px-4'>
                                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                    Inventory Status
                                </Text>
                            </View>
                            <InventoryStats />
                        </View>

                        <View className='gap-3 px-4'>
                            <View className='flex-row items-center justify-between'>
                                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                    Recent Activity
                                </Text>
                                <Text className='text-xs font-semibold text-primary-600'>View all</Text>
                            </View>
                            
                            <View className='bg-white rounded-3xl border border-neutral-100/80 overflow-hidden'>
                                <RecentActivityItem 
                                    title="Successful Swap"
                                    subtitle="Customer: KA 01 JS 1234"
                                    time="10 mins ago"
                                    type="swap"
                                />
                                <View className="h-[1px] bg-neutral-50 mx-4" />
                                <RecentActivityItem 
                                    title="Battery Inward"
                                    subtitle="From: Central Hub (Truck #42)"
                                    time="45 mins ago"
                                    type="inward"
                                />
                                <View className="h-[1px] bg-neutral-50 mx-4" />
                                <RecentActivityItem 
                                    title="Successful Swap"
                                    subtitle="Customer: KA 03 MH 9988"
                                    time="1 hr ago"
                                    type="swap"
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
