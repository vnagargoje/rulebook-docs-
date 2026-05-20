import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable } from 'react-native'

import { SafeAreaView, Text, View } from '@/components/ui'
import { useIsAuthenticated } from '@/queries/auth.query'
import { useGetMovements } from '@/queries/hub-manager'
import type { Movement } from '@/queries/hub-manager/movements.query'
import { useGetHubStation } from '@/queries/hub-manager/stations-vehicles.query'

import {
    MOVEMENT_STATUS_COLORS,
    MOVEMENT_STATUS_LABELS,
    type MovementFilterTab,
} from '@/constants/hub-manager.constants'

type FilterTab = MovementFilterTab

function MovementCard({ movement }: { movement: Movement }) {
    const status = movement.status as FilterTab
    const colors = MOVEMENT_STATUS_COLORS[status] ?? MOVEMENT_STATUS_COLORS.delivered

    return (
        <View className='mx-4 rounded-3xl border border-neutral-100 bg-white p-4'>
            <View className='flex-row items-start justify-between'>
                <View className='flex-1'>
                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                        Movement ID
                    </Text>
                    <Text
                        className='mt-0.5 text-sm font-bold text-neutral-900'
                        numberOfLines={1}>
                        {movement.id}
                    </Text>
                </View>
                <View
                    className='ml-3 flex-row items-center gap-1.5 rounded-full px-3 py-1'
                    style={{ backgroundColor: colors.bg }}>
                    <View
                        className='h-1.5 w-1.5 rounded-full'
                        style={{ backgroundColor: colors.dot }}
                    />
                    <Text
                        className='text-xs font-semibold'
                        style={{ color: colors.text }}>
                        {MOVEMENT_STATUS_LABELS[status] ?? movement.status}
                    </Text>
                </View>
            </View>

            <View className='mt-3 flex-row gap-3'>
                <View className='flex-1 rounded-2xl bg-neutral-50 p-3'>
                    <View className='flex-row items-center gap-2'>
                        <MaterialCommunityIcons
                            name='map-marker-outline'
                            size={14}
                            color='#6B7280'
                        />
                        <Text className='text-[10px] font-semibold uppercase tracking-[0.8px] text-neutral-400'>
                            From
                        </Text>
                    </View>
                    <Text
                        className='mt-1 text-xs font-semibold text-neutral-700'
                        numberOfLines={1}>
                        {movement.fromStation?.name ?? movement.fromStationId}
                    </Text>
                </View>
                <View className='flex-1 rounded-2xl bg-neutral-50 p-3'>
                    <View className='flex-row items-center gap-2'>
                        <MaterialCommunityIcons
                            name='map-marker-check-outline'
                            size={14}
                            color='#6B7280'
                        />
                        <Text className='text-[10px] font-semibold uppercase tracking-[0.8px] text-neutral-400'>
                            To
                        </Text>
                    </View>
                    <Text
                        className='mt-1 text-xs font-semibold text-neutral-700'
                        numberOfLines={1}>
                        {movement.toStation?.name ?? movement.toStationId}
                    </Text>
                </View>
            </View>

            <View className='mt-3 flex-row items-center justify-between border-t border-neutral-100 pt-3'>
                <View className='flex-row items-center gap-1.5'>
                    <MaterialCommunityIcons
                        name='truck-outline'
                        size={14}
                        color='#6B7280'
                    />
                    <Text className='text-xs text-neutral-500'>
                        {movement.vehicle?.vehicleNumber ?? 'Unknown vehicle'}
                    </Text>
                </View>
                <View className='flex-row items-center gap-1.5'>
                    <MaterialCommunityIcons
                        name='battery-outline'
                        size={14}
                        color='#6B7280'
                    />
                    <Text className='text-xs font-semibold text-neutral-700'>
                        {movement.batteryIds.length} {movement.batteryIds.length === 1 ? 'battery' : 'batteries'}
                    </Text>
                </View>
            </View>

            {movement.batteryIds.length > 0 && (
                <View className='mt-3 flex-row flex-wrap gap-1.5'>
                    {movement.batteryIds.map((id) => (
                        <View
                            key={id}
                            className='rounded-lg bg-neutral-100 px-2 py-1'>
                            <Text className='text-[10px] font-medium text-neutral-600'>{id}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
}

export default function HubManagerInventoryScreen() {
    const [activeTab, setActiveTab] = useState<FilterTab>('in_transit')

    const { data: auth } = useIsAuthenticated()
    const managerId = auth?.userId ?? ''

    const { data: stationData } = useGetHubStation({
        variables: { managerId },
        enabled: !!managerId,
    })

    const stationId = stationData?.data?.[0]?.id ?? ''

    const { data, isLoading, refetch } = useGetMovements({
        variables: {
            'filter.status': [`$eq:${activeTab}`],
            'filter.toStationId': stationId ? [`$eq:${stationId}`] : undefined,
        },
        enabled: !!stationId,
    })

    const movements = data?.data ?? []

    return (
        <SafeAreaView
            className='flex-1 bg-neutral-50'
            edges={['top']}>
            <View className='px-4 pb-3 pt-4'>
                <Text className='text-[11px] font-semibold uppercase tracking-[1.5px] text-neutral-400'>
                    Battery Movements
                </Text>
                <Text className='mt-0.5 text-2xl font-bold text-neutral-900'>Inventory</Text>
            </View>

            {/* Filter Tabs */}
            <View className='mx-4 mb-4 flex-row gap-2 rounded-2xl bg-neutral-100 p-1'>
                {(Object.keys(MOVEMENT_STATUS_LABELS) as FilterTab[]).map((tab) => (
                    <Pressable
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        className={`flex-1 items-center rounded-xl py-2 ${activeTab === tab ? 'bg-white shadow-sm' : ''}`}>
                        <Text
                            className={`text-xs font-semibold ${activeTab === tab ? 'text-neutral-900' : 'text-neutral-400'}`}>
                            {MOVEMENT_STATUS_LABELS[tab]}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {isLoading ? (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator
                        size='large'
                        color='#2563EB'
                    />
                </View>
            ) : movements.length === 0 ? (
                <View className='flex-1 items-center justify-center px-8'>
                    <MaterialCommunityIcons
                        name='battery-off-outline'
                        size={48}
                        color='#D1D5DB'
                    />
                    <Text className='mt-4 text-base font-semibold text-neutral-400'>No movements found</Text>
                    <Text className='mt-1 text-center text-sm text-neutral-400'>
                        No {MOVEMENT_STATUS_LABELS[activeTab].toLowerCase()} battery movements at this time
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={movements}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MovementCard movement={item} />}
                    contentContainerStyle={{ gap: 12, paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                    onRefresh={refetch}
                    refreshing={isLoading}
                />
            )}
        </SafeAreaView>
    )
}
