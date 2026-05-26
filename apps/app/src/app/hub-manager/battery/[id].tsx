import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useLocalSearchParams } from 'expo-router'
import { Image, ScrollView, View } from 'react-native'

import { ScreenLoader, Text } from '@/components/ui'
import { ErrorView } from '@/components/ui/error'
import { BatteryStatusBadge } from '@/components/swap-manager/batteries/status-badge'
import { BatteryPropertyRow } from '@/components/swap-manager/batteries/property-row'
import { SectionCard } from '@/components/profile/section-card'
import { InfoRow } from '@/components/customer/booking-detail'
import { formatDateIN, formatTimeIN } from '@/lib/formatters/customer'
import { useGetBatteryById } from '@/queries/hub-manager'
import { STATUS_CONFIG } from '@/data/swap-manager/battery-status-config.data'
import type { V1BatteriesGetOneBatteryResponse } from '@/services/api/codegen/Api'

type BatteryProperties = NonNullable<V1BatteriesGetOneBatteryResponse['properties']>

export default function BatteryDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { data: battery, isLoading, isError, refetch } = useGetBatteryById({
        variables: { id: id! },
    })

    if (isLoading) return <ScreenLoader label='Loading battery...' />
    if (isError || !battery) return <ErrorView onRetry={refetch} />

    const properties = (battery.properties ?? {}) as BatteryProperties
    const statusConfig = STATUS_CONFIG[battery.status]
    const hasIot = properties.socPercent != null || properties.lat != null || properties.speed != null
    const hasSpecs = properties.capacity || properties.range || properties.chargingTime || properties.lifecycle || properties.weight || properties.warranty || properties.mfgDate || properties.removableOption !== undefined
    const createdAtText = battery.createdAt
        ? `${formatDateIN(battery.createdAt)} ${formatTimeIN(battery.createdAt)}`
        : null
    const updatedAtText = battery.updatedAt
        ? `${formatDateIN(battery.updatedAt)} ${formatTimeIN(battery.updatedAt)}`
        : null

    return (
        <ScrollView
            className='flex-1 bg-neutral-50'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}>

            {/* Hero header */}
            <View className='overflow-hidden bg-[#080E1C] px-5 pb-8 pt-6'>
                <View className='absolute -right-12 -top-10 h-40 w-40 rounded-full' style={{ backgroundColor: `${statusConfig.iconColor}18` }} />
                <View className='absolute -left-10 bottom-4 h-28 w-28 rounded-full' style={{ backgroundColor: `${statusConfig.iconColor}0D` }} />

                {/* QR image + ID */}
                <View className='items-center'>
                    {battery.qrCode?.path ? (
                        <View className='overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-4'>
                            <Image
                                source={{ uri: battery.qrCode.path }}
                                className='h-28 w-28 rounded-xl'
                                resizeMode='contain'
                            />
                        </View>
                    ) : (
                        <View className='h-28 w-28 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06]'>
                            <MaterialCommunityIcons name='qrcode' size={52} color='#475569' />
                        </View>
                    )}
                    <Text className='mt-3 text-[11px] font-semibold uppercase tracking-[2px] text-[#8EA0BE]'>
                        Battery ID
                    </Text>
                    <Text className='mt-1 text-2xl font-black tracking-wider text-white'>
                        {battery.batteryQrId}
                    </Text>
                    <View className='mt-3'>
                        <BatteryStatusBadge status={battery.status} />
                    </View>
                </View>

                {/* Quick tiles row */}
                <View className='mt-6 flex-row gap-3'>
                    {properties.capacity && (
                        <View className='flex-1 items-center rounded-2xl bg-white/[0.06] py-3'>
                            <MaterialCommunityIcons name='battery-high' size={18} color='#34D399' />
                            <Text className='mt-1 text-xs font-bold text-white'>{properties.capacity}</Text>
                            <Text className='text-[10px] text-[#8EA0BE]'>Capacity</Text>
                        </View>
                    )}
                    {properties.range && (
                        <View className='flex-1 items-center rounded-2xl bg-white/[0.06] py-3'>
                            <MaterialCommunityIcons name='map-marker-distance' size={18} color='#60A5FA' />
                            <Text className='mt-1 text-xs font-bold text-white'>{properties.range}</Text>
                            <Text className='text-[10px] text-[#8EA0BE]'>Range</Text>
                        </View>
                    )}
                    {battery.gpsId && (
                        <View className='flex-1 items-center rounded-2xl bg-white/[0.06] py-3'>
                            <MaterialCommunityIcons name='crosshairs-gps' size={18} color='#A78BFA' />
                            <Text className='mt-1 text-xs font-bold text-white' numberOfLines={1}>{battery.gpsId}</Text>
                            <Text className='text-[10px] text-[#8EA0BE]'>GPS ID</Text>
                        </View>
                    )}
                </View>
            </View>

            <View className='pt-1'>
                {/* Station info */}
                {battery.station && (
                    <SectionCard title='Assigned Station'>
                        <View className='flex-row items-center gap-4'>
                            <View className='h-11 w-11 items-center justify-center rounded-2xl bg-warning-50'>
                                <MaterialCommunityIcons name='map-marker' size={22} color='#D97706' />
                            </View>
                            <View className='flex-1'>
                                <Text className='text-base font-bold text-neutral-900'>
                                    {battery.station.name ?? 'Station'}
                                </Text>
                                {battery.station.type && (
                                    <Text className='mt-0.5 text-xs capitalize text-neutral-500'>
                                        {battery.station.type.replace('_', ' ')}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </SectionCard>
                )}

                {/* Live telemetry (IoT fields) */}
                {hasIot && (
                    <SectionCard title='Live Telemetry'>
                        {properties.socPercent != null && (
                            <View className='mb-4'>
                                <View className='mb-1.5 flex-row justify-between'>
                                    <Text className='text-xs font-semibold text-neutral-500'>State of Charge</Text>
                                    <Text className='text-xs font-bold text-primary-700'>{properties.socPercent}%</Text>
                                </View>
                                <View className='h-2.5 overflow-hidden rounded-full bg-neutral-100'>
                                    <View
                                        className={`h-2.5 rounded-full ${properties.socPercent > 60 ? 'bg-emerald-500' : properties.socPercent > 25 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(100, properties.socPercent)}%` }}
                                    />
                                </View>
                            </View>
                        )}
                        <View className='flex-row flex-wrap gap-2'>
                            {properties.speed != null && (
                                <View className='flex-row items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-3 py-2.5' style={{ minWidth: '45%' }}>
                                    <View className='h-7 w-7 items-center justify-center rounded-xl bg-sky-100'>
                                        <MaterialCommunityIcons name='speedometer' size={14} color='#0284C7' />
                                    </View>
                                    <View>
                                        <Text className='text-[11px] text-sky-600'>Speed</Text>
                                        <Text className='text-sm font-bold text-sky-900'>{properties.speed} km/h</Text>
                                    </View>
                                </View>
                            )}
                            {properties.lat != null && properties.long != null && (
                                <View className='flex-row items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 px-3 py-2.5' style={{ minWidth: '45%' }}>
                                    <View className='h-7 w-7 items-center justify-center rounded-xl bg-violet-100'>
                                        <MaterialCommunityIcons name='map-marker-outline' size={14} color='#7C3AED' />
                                    </View>
                                    <View className='flex-1'>
                                        <Text className='text-[11px] text-violet-600'>Location</Text>
                                        <Text className='text-[11px] font-bold text-violet-900' numberOfLines={1}>
                                            {Number(properties.lat).toFixed(5)}, {Number(properties.long).toFixed(5)}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </SectionCard>
                )}

                {/* Specifications */}
                {hasSpecs && (
                    <SectionCard title='Specifications'>
                        <View className='gap-3'>
                            {properties.chargingTime && (
                                <BatteryPropertyRow icon='lightning-bolt' iconColor='#D97706' iconBg='#FEF3C7' label='Charging Time' value={properties.chargingTime} />
                            )}
                            {properties.lifecycle && (
                                <BatteryPropertyRow icon='refresh' iconColor='#059669' iconBg='#D1FAE5' label='Lifecycle' value={properties.lifecycle} />
                            )}
                            {properties.weight && (
                                <BatteryPropertyRow icon='weight' iconColor='#6B7280' iconBg='#F3F4F6' label='Weight' value={properties.weight} />
                            )}
                            {properties.warranty && (
                                <BatteryPropertyRow icon='shield-check-outline' iconColor='#2563EB' iconBg='#EFF6FF' label='Warranty' value={properties.warranty} />
                            )}
                            {properties.mfgDate && (
                                <BatteryPropertyRow icon='calendar-outline' iconColor='#7C3AED' iconBg='#EDE9FE' label='Mfg Date' value={properties.mfgDate} />
                            )}
                            {properties.removableOption !== undefined && (
                                <BatteryPropertyRow icon='swap-horizontal' iconColor='#0891B2' iconBg='#ECFEFF' label='Removable' value={properties.removableOption ? 'Yes' : 'No'} />
                            )}
                        </View>
                    </SectionCard>
                )}

                {/* Record info */}
                <SectionCard title='Record Info'>
                    <View className='mb-3 rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-2.5'>
                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                            Record ID
                        </Text>
                        <Text className='mt-1 text-xs font-bold tracking-[0.8px] text-neutral-900'>
                            {battery.id}
                        </Text>
                    </View>

                    <View className='gap-1'>
                        {createdAtText && (
                            <InfoRow
                                icon='calendar-plus'
                                iconColor='#2563EB'
                                iconBg='bg-blue-100'
                                label='Created On'
                                value={createdAtText}
                            />
                        )}
                        {updatedAtText && (
                            <InfoRow
                                icon='calendar-refresh'
                                iconColor='#7C3AED'
                                iconBg='bg-violet-100'
                                label='Last Updated'
                                value={updatedAtText}
                            />
                        )}
                    </View>
                </SectionCard>
            </View>
        </ScrollView>
    )
}
