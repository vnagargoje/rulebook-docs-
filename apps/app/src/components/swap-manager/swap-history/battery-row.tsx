import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'
import { Text } from '@/components/ui'

interface Props {
    label: string
    batteryQrId?: string
    variant: 'old' | 'new'
}

export function SwapBatteryRow({ label, batteryQrId, variant }: Props) {
    const isNew = variant === 'new'

    return (
        <View className='flex-1 items-center gap-1.5'>
            <View className={`h-9 w-9 items-center justify-center rounded-xl ${isNew ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <MaterialCommunityIcons
                    name={isNew ? 'battery-high' : 'battery-low'}
                    size={18}
                    color={isNew ? '#059669' : '#EF4444'}
                />
            </View>
            <Text className='text-[10px] font-semibold uppercase tracking-wider text-neutral-400'>{label}</Text>
            <View className={`rounded-lg px-2 py-0.5 ${isNew ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <Text className={`text-[11px] font-bold ${isNew ? 'text-emerald-700' : 'text-red-600'}`}>
                    {batteryQrId ?? '—'}
                </Text>
            </View>
        </View>
    )
}
