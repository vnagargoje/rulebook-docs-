import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable } from 'react-native'

import { SafeAreaView, Text, View } from '@/components/ui'
import { BatteryQrChip } from '@/components/shared/battery-qr-chip'
import { useIsAuthenticated } from '@/queries/auth.query'
import {
    useGetFromStationMovements,
    useGetStationMovements,
} from '@/queries/swap-manager/battery-transport.query'
import type { SMMovement } from '@/queries/swap-manager/battery-transport.query'
import { useManagerSwapStation } from '@/queries/swap-manager/swap-station.query'

type FilterTab = 'in_transit' | 'delivered'

const STATUS_LABELS: Record<FilterTab, string> = {
    in_transit: 'In Transit',
    delivered: 'Delivered',
}

const STATUS_COLORS: Record<FilterTab, { bg: string; text: string; dot: string }> = {
    in_transit: { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B' },
    delivered: { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' },
}

function MovementCard({ movement }: { movement: SMMovement }) {
    const status = movement.status as FilterTab
    const colors = STATUS_COLORS[status] ?? STATUS_COLORS.delivered

    return (
        <View className='mx-4 rounded-3xl border border-neutral-100 bg-white p-4'>
            <View className='flex-row items-center justify-end'>
                <View
                    className='flex-row items-center gap-1.5 rounded-full px-3 py-1'
                    style={{ backgroundColor: colors.bg }}>
                    <View
                        className='h-1.5 w-1.5 rounded-full'
                        style={{ backgroundColor: colors.dot }}
                    />
                    <Text
                        className='text-xs font-semibold'
                        style={{ color: colors.text }}>
                        {STATUS_LABELS[status] ?? movement.status}
                    </Text>
                </View>
            </View>

            <View className='mt-3 flex-row gap-3'>
                <View className='flex-1 rounded-2xl bg-neutral-50 p-3'>
                    <View className='flex-row items-center gap-2'>
                        <MaterialCommunityIcons name='map-marker-outline' size={14} color='#6B7280' />
                        <Text className='text-[10px] font-semibold uppercase tracking-[0.8px] text-neutral-400'>
                            From
                        </Text>
                    </View>
                    <Text className='mt-1 text-xs font-semibold text-neutral-700' numberOfLines={1}>
                        {movement.fromStation?.name ?? movement.fromStationId}
                    </Text>
                </View>
                <View className='flex-1 rounded-2xl bg-neutral-50 p-3'>
                    <View className='flex-row items-center gap-2'>
                        <MaterialCommunityIcons name='map-marker-check-outline' size={14} color='#6B7280' />
                        <Text className='text-[10px] font-semibold uppercase tracking-[0.8px] text-neutral-400'>
                            To
                        </Text>
                    </View>
                    <Text className='mt-1 text-xs font-semibold text-neutral-700' numberOfLines={1}>
                        {movement.toStation?.name ?? movement.toStationId}
                    </Text>
                </View>
            </View>

            <View className='mt-3 flex-row items-center justify-between border-t border-neutral-100 pt-3'>
                <View className='flex-row items-center gap-1.5'>
                    <MaterialCommunityIcons name='truck-outline' size={14} color='#6B7280' />
                    <Text className='text-xs text-neutral-500'>
                        {movement.vehicle?.vehicleNumber ?? 'Unknown vehicle'}
                    </Text>
                </View>
                <View className='flex-row items-center gap-1.5'>
                    <MaterialCommunityIcons name='battery-outline' size={14} color='#6B7280' />
                    <Text className='text-xs font-semibold text-neutral-700'>
                        {movement.batteryIds.length} {movement.batteryIds.length === 1 ? 'battery' : 'batteries'}
                    </Text>
                </View>
            </View>

            {movement.createdAt && (
                <View className='mt-2 flex-row items-center gap-1.5'>
                    <MaterialCommunityIcons name='clock-outline' size={12} color='#9CA3AF' />
                    <Text className='text-[10px] text-neutral-400'>
                        {new Date(movement.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>
            )}

            {movement.batteryIds.length > 0 && (
                <View className='mt-3 flex-row flex-wrap gap-1.5'>
                    {movement.batteryIds.map((id) => (
                        <BatteryQrChip key={id} batteryId={id} />
                    ))}
                </View>
            )}
        </View>
    )
}

export default function SwapManagerMovementHistoryScreen() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<FilterTab>('in_transit')

    const { data: auth } = useIsAuthenticated()
    const managerId = auth?.userId ?? ''

    const { data: station } = useManagerSwapStation({
        variables: { managerId },
        enabled: !!managerId,
    })

    const stationId = station?.id ?? ''

    const { data: inboundData, isLoading: inboundLoading } = useGetStationMovements({
        variables: { toStationId: stationId, status: activeTab },
        enabled: !!stationId,
    })

    const { data: outboundData, isLoading: outboundLoading } = useGetFromStationMovements({
        variables: { fromStationId: stationId, status: activeTab },
        enabled: !!stationId,
    })

    const movements = useMemo(() => {
        const seen = new Set<string>()
        return [
            ...(inboundData?.data ?? []),
            ...(outboundData?.data ?? []),
        ]
            .filter((m) => { if (seen.has(m.id)) return false; seen.add(m.id); return true })
            .sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime())
    }, [inboundData, outboundData])

    const isLoading = inboundLoading || outboundLoading

    return (
        <SafeAreaView className='flex-1 bg-neutral-50' edges={['top']}>
            <View className='flex-row items-center gap-3 px-4 pb-3 pt-4'>
                <Pressable
                    onPress={() => router.back()}
                    className='h-9 w-9 items-center justify-center rounded-xl bg-neutral-100'>
                    <MaterialCommunityIcons name='arrow-left' size={20} color='#374151' />
                </Pressable>
                <View>
                    <Text className='text-[11px] font-semibold uppercase tracking-[1.5px] text-neutral-400'>
                        Battery Transport
                    </Text>
                    <Text className='text-xl font-bold text-neutral-900'>History</Text>
                </View>
            </View>

            <View className='mx-4 mb-4'>
                <Text className='mb-2 text-xs text-neutral-400'>{station?.name ?? '–'}</Text>
                <View className='flex-row gap-2 rounded-2xl bg-neutral-100 p-1'>
                    {(Object.keys(STATUS_LABELS) as FilterTab[]).map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 items-center rounded-xl py-2.5 ${activeTab === tab ? 'bg-white shadow-sm' : ''}`}>
                            <Text
                                className={`text-xs font-semibold ${activeTab === tab ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                {STATUS_LABELS[tab]}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {isLoading ? (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator size='large' color='#2563EB' />
                </View>
            ) : movements.length === 0 ? (
                <View className='flex-1 items-center justify-center px-8'>
                    <MaterialCommunityIcons name='battery-off-outline' size={48} color='#D1D5DB' />
                    <Text className='mt-4 text-base font-semibold text-neutral-400'>No movements found</Text>
                    <Text className='mt-1 text-center text-sm text-neutral-400'>
                        No {STATUS_LABELS[activeTab].toLowerCase()} battery movements for this station
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={movements}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MovementCard movement={item} />}
                    contentContainerStyle={{ gap: 12, paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    )
}
