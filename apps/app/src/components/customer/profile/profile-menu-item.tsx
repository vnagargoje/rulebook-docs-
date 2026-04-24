import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Pressable, Text, View } from '@/components/ui'

type Props = {
    icon: string
    label: string
    subtitle?: string
    onPress?: () => void
    color?: string
    value?: string
}

export function ProfileMenuItem({ icon, label, subtitle, onPress, color = '#2563EB', value }: Props) {
    return (
        <Pressable onPress={onPress}>
            <View className='flex-row items-center gap-4 py-3.5'>
                <View className='h-10 w-10 items-center justify-center rounded-xl bg-neutral-100'>
                    <MaterialCommunityIcons name={icon as any} size={20} color={color} />
                </View>
                <View className='flex-1'>
                    <Text className='text-[15px] font-medium text-neutral-900'>{label}</Text>
                    {subtitle ? (
                        <Text className='mt-0.5 text-xs text-neutral-500'>{subtitle}</Text>
                    ) : null}
                </View>
                {value ? (
                    <Text className='text-xs font-semibold text-neutral-400'>{value}</Text>
                ) : null}
                <MaterialCommunityIcons name='chevron-right' size={20} color='#D1D5DB' />
            </View>
        </Pressable>
    )
}
