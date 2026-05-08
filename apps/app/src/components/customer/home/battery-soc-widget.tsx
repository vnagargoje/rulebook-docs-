import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'

import { Text } from '@/components/ui'
import { useGetBatteryById } from '@/queries/hub-manager'
import { STATUS_CONFIG } from '@/data/swap-manager/battery-status-config.data'
import type { V1BatteriesGetOneBatteryResponse } from '@/services/api/codegen/Api'
import { CircularSoc } from './circular-soc'

type BatteryProperties = NonNullable<V1BatteriesGetOneBatteryResponse['properties']>

type Props = {
    batteryId: string
}

export function BatterySocWidget({ batteryId }: Props) {
    const { data: battery, isLoading } = useGetBatteryById({ variables: { id: batteryId } })

    if (isLoading || !battery) {
        return (
            <View className='mt-4 flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3'>
                <View className='h-[72px] w-[72px] items-center justify-center rounded-full border-[7px] border-[#1E293B]' />
                <View className='flex-1 gap-1.5'>
                    <View className='h-3 w-24 rounded bg-white/10' />
                    <View className='h-3 w-16 rounded bg-white/10' />
                </View>
            </View>
        )
    }

    const properties = (battery.properties ?? {}) as BatteryProperties
    const soc = properties.socPercent
    const statusConfig = STATUS_CONFIG[battery.status]

    return (
        <View className='mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4'>
            <Text className='mb-3 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#8EA0BE]'>
                Battery Status
            </Text>
            <View className='flex-row items-center gap-4'>
                {/* Circular SOC or fallback icon */}
                {soc != null ? (
                    <CircularSoc percent={soc} size={72} strokeWidth={7} />
                ) : (
                    <View className='h-[72px] w-[72px] items-center justify-center rounded-full border-[7px] border-[#1E293B]'>
                        <MaterialCommunityIcons name={statusConfig.icon as any} size={28} color={statusConfig.iconColor} />
                    </View>
                )}

                {/* Details */}
                <View className='flex-1 gap-2'>
                    {/* Status badge */}
                    <View className={`self-start flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${statusConfig.bg}`}>
                        <MaterialCommunityIcons name={statusConfig.icon as any} size={11} color={statusConfig.iconColor} />
                        <Text className={`text-[11px] font-bold ${statusConfig.text}`}>{statusConfig.label}</Text>
                    </View>

                    {/* QR ID */}
                    <View className='flex-row items-center gap-1.5'>
                        <MaterialCommunityIcons name='qrcode' size={12} color='#5A6A82' />
                        <Text className='text-xs font-semibold tracking-[0.5px] text-[#8EA0BE]'>
                            {battery.batteryQrId}
                        </Text>
                    </View>

                    {/* Capacity + Speed row */}
                    <View className='flex-row gap-2'>
                        {properties.capacity ? (
                            <View className='flex-row items-center gap-1'>
                                <MaterialCommunityIcons name='battery-high' size={11} color='#34D399' />
                                <Text className='text-[11px] text-[#8EA0BE]'>{properties.capacity}</Text>
                            </View>
                        ) : null}
                        {properties.speed != null ? (
                            <View className='flex-row items-center gap-1'>
                                <MaterialCommunityIcons name='speedometer' size={11} color='#60A5FA' />
                                <Text className='text-[11px] text-[#8EA0BE]'>{properties.speed} km/h</Text>
                            </View>
                        ) : null}
                    </View>
                </View>
            </View>
        </View>
    )
}
