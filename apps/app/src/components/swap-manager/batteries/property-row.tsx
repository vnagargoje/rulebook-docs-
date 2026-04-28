import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'
import { Text } from '@/components/ui'

interface Props {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']
    iconColor: string
    iconBg: string
    label: string
    value: string
}

export function BatteryPropertyRow({ icon, iconColor, iconBg, label, value }: Props) {
    return (
        <View className='flex-row items-center gap-2'>
            <View
                className='h-7 w-7 items-center justify-center rounded-lg'
                style={{ backgroundColor: iconBg }}>
                <MaterialCommunityIcons
                    name={icon}
                    size={14}
                    color={iconColor}
                />
            </View>
            <View className='flex-1 flex-row items-center justify-between'>
                <Text className='text-xs text-neutral-400'>{label}</Text>
                <Text className='text-xs font-semibold text-neutral-700'>{value}</Text>
            </View>
        </View>
    )
}
