import { useRouter } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { RefreshControl } from 'react-native'

import { ActionCard, InventoryStats, RecentActivityItem } from '@/components/swap-manager/home'
import { SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { useIsAuthenticated } from '@/queries/auth.query'
import { useStationBatteryCounts } from '@/queries/swap-manager/batteries.query'
import { useGetDeliveredMovementsToStation } from '@/queries/swap-manager/battery-transport.query'
import { useRecentSwapHistory } from '@/queries/swap-manager/swap-history.query'
import { useManagerSwapStation } from '@/queries/swap-manager/swap-station.query'
import { timeAgo } from '@/lib/formatters'

export default function () {
    const router = useRouter()

    const { data: auth } = useIsAuthenticated()
    const managerId = auth?.userId ?? ''

    const { data: station, refetch: refetchStation } = useManagerSwapStation({
        variables: { managerId },
        enabled: !!managerId,
    })

    const { data: batteryCounts, isLoading: batteryCountsLoading, refetch: refetchCounts } = useStationBatteryCounts({
        variables: { managerId },
        enabled: !!managerId,
    })

    const { data: recentSwaps, refetch: refetchSwaps } = useRecentSwapHistory({
        variables: { managerId },
        enabled: !!managerId,
    })

    const { data: inwardMovements, refetch: refetchMovements } = useGetDeliveredMovementsToStation({
        variables: { toStationId: station?.id ?? '' },
        enabled: !!station?.id,
    })

    const recentActivity = useMemo(() => {
        const swaps = (recentSwaps?.data ?? []).map(s => ({
            id: s.id,
            type: 'swap' as const,
            title: 'Successful Swap',
            subtitle: `Customer: ${s.userPlan?.user.mobilenumber ?? '–'}`,
            date: s.createdAt,
        }))
        const inward = (inwardMovements?.data ?? []).map(m => ({
            id: m.id,
            type: 'inward' as const,
            title: 'Battery Inward',
            subtitle: `From: ${m.fromStation?.name ?? '–'} (${m.vehicle?.vehicleNumber ?? '–'})`,
            date: m.receivedAt ?? m.createdAt ?? '',
        }))
        return [...swaps, ...inward]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
    }, [recentSwaps, inwardMovements])

    const handleRefresh = useCallback(() => {
        refetchStation()
        refetchCounts()
        refetchSwaps()
        if (station?.id) refetchMovements()
    }, [refetchStation, refetchCounts, refetchSwaps, refetchMovements, station?.id])

    const handleExecuteSwap = useCallback(() => {
        router.push('/swap-manager/execute-swap')
    }, [router])

    const isRefreshing = false

    return (
        <SafeAreaView
            className='flex-1 bg-neutral-50'
            edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
                contentContainerStyle={{ paddingBottom: 40 }}>
                <View className='gap-6'>
                    <View className='px-4 pt-4'>
                        <Text className='text-[11px] font-semibold uppercase tracking-[1.5px] text-neutral-400'>
                            Welcome Back, Manager
                        </Text>
                        <Text className='mt-0.5 text-2xl font-bold text-neutral-900'>Station Dashboard</Text>
                        <View className='mt-2 flex-row items-center gap-1.5'>
                            <View className='h-2 w-2 rounded-full bg-primary-500' />
                            <Text className='text-sm font-medium text-neutral-600'>
                                {station?.name ?? '–'}
                            </Text>
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
                        <InventoryStats
                            available={batteryCounts?.available ?? 0}
                            drained={batteryCounts?.drained ?? 0}
                            isLoading={batteryCountsLoading}
                        />
                    </View>

                    <View className='gap-3 px-4'>
                        <View className='flex-row items-center justify-between'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                Recent Activity
                            </Text>
                        </View>

                        {recentActivity.length === 0 ? (
                            <View className='items-center rounded-3xl border border-neutral-100/80 bg-white py-8'>
                                <Text className='text-sm font-medium text-neutral-400'>No recent activity</Text>
                            </View>
                        ) : (
                            <View className='bg-white rounded-3xl border border-neutral-100/80 overflow-hidden'>
                                {recentActivity.map((item, index) => (
                                    <View key={item.id}>
                                        {index > 0 && <View className='h-[1px] bg-neutral-50 mx-4' />}
                                        <RecentActivityItem
                                            title={item.title}
                                            subtitle={item.subtitle}
                                            time={timeAgo(item.date)}
                                            type={item.type}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
