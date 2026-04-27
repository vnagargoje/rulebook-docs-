import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ScrollView } from 'react-native'

import { Text, View } from '@/components/ui'

interface ConfirmBatteryListProps {
    batteryQrIds: string[]
    label?: string
    batteryIconName?: 'battery-outline' | 'battery-charging'
    batteryIconColor?: string
    batteryIconBgClass?: string
}

export function ConfirmBatteryList({
    batteryQrIds,
    label = 'Batteries',
    batteryIconName = 'battery-outline',
    batteryIconColor = '#2563EB',
    batteryIconBgClass = 'bg-primary-50',
}: ConfirmBatteryListProps) {
    return (
        <View className='flex-1 px-4 mt-4'>
            <View className='flex-row items-center justify-between mb-3'>
                <Text className='text-xs font-bold uppercase tracking-[1px] text-neutral-400'>{label}</Text>
                <View className='rounded-full bg-primary-100 px-2.5 py-0.5'>
                    <Text className='text-xs font-bold text-primary-600'>{batteryQrIds.length}</Text>
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
                {batteryQrIds.map((batteryQrId, index) => (
                    <View
                        key={batteryQrId}
                        className='flex-row items-center rounded-2xl border border-neutral-100 bg-white px-4 py-3'>
                        <View className='h-7 w-7 items-center justify-center rounded-xl bg-primary-50'>
                            <Text className='text-[11px] font-bold text-primary-600'>{index + 1}</Text>
                        </View>
                        <View className={`h-8 w-8 items-center justify-center rounded-xl ml-2 ${batteryIconBgClass}`}>
                            <MaterialCommunityIcons
                                name={batteryIconName}
                                size={16}
                                color={batteryIconColor}
                            />
                        </View>
                        <Text
                            className='ml-3 flex-1 text-sm font-semibold text-neutral-800'
                            numberOfLines={1}>
                            {batteryQrId}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}
