import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'

import { Text, View } from '@/components/ui'

interface ScannedBatteryItemProps {
    batteryQrId: string
    onRemove: (id: string) => void
    iconName?: 'battery-outline' | 'battery-charging'
    iconColor?: string
    iconBgClass?: string
}

export function ScannedBatteryItem({
    batteryQrId,
    onRemove,
    iconName = 'battery-outline',
    iconColor = '#2563EB',
    iconBgClass = 'bg-primary-50',
}: ScannedBatteryItemProps) {
    return (
        <View className='flex-row items-center rounded-2xl border border-neutral-100 bg-white px-4 py-3'>
            <View className={`h-8 w-8 items-center justify-center rounded-xl ${iconBgClass}`}>
                <MaterialCommunityIcons
                    name={iconName}
                    size={16}
                    color={iconColor}
                />
            </View>
            <Text
                className='ml-3 flex-1 text-sm font-semibold text-neutral-800'
                numberOfLines={1}>
                {batteryQrId}
            </Text>
            <Pressable
                onPress={() => onRemove(batteryQrId)}
                className='ml-2 h-7 w-7 items-center justify-center rounded-full bg-red-50 active:opacity-70'>
                <MaterialCommunityIcons
                    name='close'
                    size={14}
                    color='#DC2626'
                />
            </Pressable>
        </View>
    )
}
