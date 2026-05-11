import { useRouter } from 'expo-router'
import { RefreshControl } from 'react-native'

import { StatRow, TransportCard } from '@/components/swap-manager/inventory'
import { SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { useIsAuthenticated } from '@/queries/auth.query'
import { useStationBatteryCounts } from '@/queries/swap-manager/batteries.query'
import { useGetInTransitMovementsToStation } from '@/queries/swap-manager/battery-transport.query'
import { useManagerSwapStation } from '@/queries/swap-manager/swap-station.query'

export default function InventoryScreen() {
    const router = useRouter()

    const { data: auth } = useIsAuthenticated()
    const managerId = auth?.userId ?? ''

    const { data: station, refetch: refetchStation } = useManagerSwapStation({
        variables: { managerId },
        enabled: !!managerId,
    })

    const { data: counts, isLoading: countsLoading, refetch: refetchCounts } = useStationBatteryCounts({
        variables: { managerId },
        enabled: !!managerId,
    })

    const { data: inboundMovements, refetch: refetchMovements } = useGetInTransitMovementsToStation({
        variables: { toStationId: station?.id ?? '' },
        enabled: !!station?.id,
    })

    const inboundCount = inboundMovements?.data?.length ?? 0

    const handleRefresh = () => {
        refetchStation()
        refetchCounts()
        if (station?.id) refetchMovements()
    }

    return (
        <SafeAreaView className='flex-1 bg-neutral-50' edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
                contentContainerStyle={{ paddingBottom: 40 }}>
                <View className='gap-6'>

                    {/* Header */}
                    <View className='px-4 pt-4'>
                        <Text className='text-2xl font-bold text-neutral-900'>Inventory</Text>
                        <View className='mt-1.5 flex-row items-center gap-1.5'>
                            <View className='h-1.5 w-1.5 rounded-full bg-primary-500' />
                            <Text className='text-sm text-neutral-500'>{station?.name ?? '–'}</Text>
                        </View>
                    </View>

                    {/* Battery Status */}
                    <View className='gap-2 px-4'>
                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                            Battery Status
                        </Text>
                        <View className='overflow-hidden rounded-2xl border border-neutral-100 bg-white'>
                            <StatRow
                                label='Charged'
                                value={counts?.charged ?? 0}
                                icon='battery-charging-100'
                                iconColor='#10B981'
                                dot='bg-emerald-400'
                                isLoading={countsLoading}
                                showDivider
                            />
                            <StatRow
                                label='Charging'
                                value={counts?.charging ?? 0}
                                icon='battery-charging-50'
                                iconColor='#3B82F6'
                                dot='bg-blue-400'
                                isLoading={countsLoading}
                                showDivider
                            />
                            <StatRow
                                label='Drained'
                                value={counts?.drained ?? 0}
                                icon='battery-alert-variant-outline'
                                iconColor='#EF4444'
                                dot='bg-red-400'
                                isLoading={countsLoading}
                                showDivider
                            />
                            <StatRow
                                label='In Transit'
                                value={counts?.inTransit ?? 0}
                                icon='truck-fast-outline'
                                iconColor='#8B5CF6'
                                dot='bg-violet-400'
                                isLoading={countsLoading}
                            />
                        </View>
                    </View>

                    {/* Transport */}
                    <View className='gap-2 px-4'>
                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                            Battery Transport
                        </Text>
                        <View className='overflow-hidden rounded-2xl border border-neutral-100 bg-white'>
                            <TransportCard
                                title='Receive from Hub'
                                subtitle='Accept incoming charged batteries'
                                iconName='battery-arrow-down-outline'
                                iconColor='#10B981'
                                badge={inboundCount}
                                onPress={() => router.push('/swap-manager/battery-inward')}
                            />
                            <View className='h-[1px] bg-neutral-50 mx-4' />
                            <TransportCard
                                title='Send to Hub'
                                subtitle='Dispatch drained batteries for charging'
                                iconName='battery-arrow-up-outline'
                                iconColor='#D97706'
                                onPress={() => router.push('/swap-manager/battery-outward')}
                            />
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
