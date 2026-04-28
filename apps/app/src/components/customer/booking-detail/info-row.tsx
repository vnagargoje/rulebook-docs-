import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Text, View } from '@/components/ui'

type Props = {
    icon: string
    iconColor: string
    iconBg: string
    label: string
    value: string
    valueStyle?: string
}

export function InfoRow({ icon, iconColor, iconBg, label, value, valueStyle }: Props) {
    return (
        <View className='flex-row items-center gap-4 py-3.5'>
            <View className={`h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
                <MaterialCommunityIcons name={icon as any} size={18} color={iconColor} />
            </View>
            <View className='flex-1'>
                <Text className='text-xs text-neutral-500'>{label}</Text>
                <Text className={`mt-0.5 text-[15px] font-semibold text-neutral-900 ${valueStyle ?? ''}`}>
                    {value}
                </Text>
            </View>
        </View>
    )
}
