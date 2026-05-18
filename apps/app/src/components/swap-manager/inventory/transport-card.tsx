import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import type { ComponentProps } from 'react'

import { Pressable, Text, View } from '@/components/ui'

export type TransportCardProps = {
    title: string
    subtitle: string
    iconName: ComponentProps<typeof MaterialCommunityIcons>['name']
    iconColor: string
    badge?: number
    onPress: () => void
}

export function TransportCard({ title, subtitle, iconName, iconColor, badge, onPress }: TransportCardProps) {
    return (
        <Pressable
            onPress={onPress}
            className='flex-row items-center gap-4 rounded-2xl bg-white px-4 py-4 active:opacity-70'>
            <MaterialCommunityIcons name={iconName} size={22} color={iconColor} />
            <View className='flex-1'>
                <View className='flex-row items-center gap-2'>
                    <Text className='text-[13px] font-semibold text-neutral-900'>{title}</Text>
                    {badge != null && badge > 0 && (
                        <View className='h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 px-1.5'>
                            <Text className='text-[10px] font-bold text-white'>{badge}</Text>
                        </View>
                    )}
                </View>
                <Text className='mt-0.5 text-xs text-neutral-400'>{subtitle}</Text>
            </View>
            <MaterialCommunityIcons name='chevron-right' size={18} color='#CBD5E1' />
        </Pressable>
    )
}