import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Pressable, Text, View } from '@/components/ui'

type Props = {
    icon: string
    title: string
    subtitle: string
    onPress: () => void
    color: string
}

export function ActionTile({ icon, title, subtitle, onPress, color }: Props) {
    return (
        <Pressable onPress={onPress} style={{ width: '48%' }}>
            <View className='rounded-2xl border border-neutral-200 bg-white p-4'>
                <View
                    className='mb-3 h-10 w-10 items-center justify-center rounded-xl'
                    style={{ backgroundColor: `${color}1A` }}>
                    <MaterialCommunityIcons name={icon as any} size={20} color={color} />
                </View>
                <Text className='text-sm font-semibold text-neutral-900'>{title}</Text>
                <Text className='mt-1 text-xs leading-4 text-neutral-500'>{subtitle}</Text>
            </View>
        </Pressable>
    )
}
