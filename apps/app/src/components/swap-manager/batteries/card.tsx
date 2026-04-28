import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Text } from '@/components/ui'
import { BatteryQrImage } from './qr-image'
import { BatteryPropertyRow } from './property-row'
import { V1BatteriesGetOneBatteryResponse } from '@/services/api/codegen/Api'
import { BatteryStatusBadge } from './status-badge'

interface Props {
    battery: V1BatteriesGetOneBatteryResponse
}

export function BatteryCard({ battery }: Props) {
    const [expanded, setExpanded] = useState(false)
    const { properties: p } = battery
    const hasProperties = p && Object.values(p).some((v) => v !== undefined && v !== null)

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setExpanded((prev) => !prev)}
            className='mx-4 mb-3 overflow-hidden rounded-3xl border border-neutral-200 bg-white'>
            <View className='flex-row items-center gap-4 p-4'>
                <BatteryQrImage
                    qrCode={battery.qrCode}
                    batteryQrId={battery.batteryQrId}
                />

                <View className='flex-1 gap-2'>
                    <View className='flex-col items-start gap-1'>
                        <View className='rounded-lg bg-primary-50 px-2 py-0.5'>
                            <Text className='text-xs font-bold text-primary-600'>{battery.batteryQrId}</Text>
                        </View>
                        <BatteryStatusBadge status={battery.status} />
                    </View>

                    {battery.gpsId && (
                        <View className='flex-row items-center gap-1.5'>
                            <MaterialCommunityIcons
                                name='crosshairs-gps'
                                size={13}
                                color='#7C3AED'
                            />
                            <Text className='text-xs text-neutral-500'>{battery.gpsId}</Text>
                        </View>
                    )}

                    <View className='flex-row gap-2 mt-0.5'>
                        {p?.capacity && (
                            <View className='rounded-lg bg-emerald-50 px-2 py-0.5'>
                                <Text className='text-[11px] font-semibold text-emerald-700'>{p.capacity}</Text>
                            </View>
                        )}
                        {p?.range && (
                            <View className='rounded-lg bg-sky-50 px-2 py-0.5'>
                                <Text className='text-[11px] font-semibold text-sky-700'>{p.range}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <MaterialCommunityIcons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color='#D1D5DB'
                />
            </View>

            {expanded && hasProperties && (
                <View className='border-t border-neutral-100 px-4 pb-4 pt-3 gap-2.5'>
                    <Text className='mb-1 text-[10px] font-bold uppercase tracking-[1.2px] text-neutral-400'>
                        Specifications
                    </Text>
                    {p?.chargingTime && (
                        <BatteryPropertyRow
                            icon='lightning-bolt'
                            iconColor='#D97706'
                            iconBg='#FEF3C7'
                            label='Charging Time'
                            value={p.chargingTime}
                        />
                    )}
                    {p?.lifecycle && (
                        <BatteryPropertyRow
                            icon='refresh'
                            iconColor='#059669'
                            iconBg='#D1FAE5'
                            label='Lifecycle'
                            value={p.lifecycle}
                        />
                    )}
                    {p?.weight && (
                        <BatteryPropertyRow
                            icon='weight'
                            iconColor='#6B7280'
                            iconBg='#F3F4F6'
                            label='Weight'
                            value={p.weight}
                        />
                    )}
                    {p?.warranty && (
                        <BatteryPropertyRow
                            icon='shield-check-outline'
                            iconColor='#2563EB'
                            iconBg='#EFF6FF'
                            label='Warranty'
                            value={p.warranty}
                        />
                    )}
                    {p?.mfgDate && (
                        <BatteryPropertyRow
                            icon='calendar-outline'
                            iconColor='#7C3AED'
                            iconBg='#EDE9FE'
                            label='Mfg Date'
                            value={p.mfgDate}
                        />
                    )}
                    {p?.removableOption !== undefined && (
                        <BatteryPropertyRow
                            icon='swap-horizontal'
                            iconColor='#0891B2'
                            iconBg='#ECFEFF'
                            label='Removable'
                            value={p.removableOption ? 'Yes' : 'No'}
                        />
                    )}
                </View>
            )}
        </TouchableOpacity>
    )
}
