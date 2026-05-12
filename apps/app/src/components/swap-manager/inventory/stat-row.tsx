import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import type { ComponentProps } from 'react'

import { Text, View } from '@/components/ui'

export type StatRowProps = {
    label: string
    value: number
    icon: ComponentProps<typeof MaterialCommunityIcons>['name']
    iconColor: string
    dot: string
    isLoading?: boolean
    showDivider?: boolean
}

export function StatRow({ label, value, icon, iconColor, dot, isLoading, showDivider }: StatRowProps) {
    return (
        <>
            <View className='flex-row items-center px-5 py-4'>
                <View className='mr-3 h-9 w-9 items-center justify-center rounded-xl bg-neutral-50'>
                    <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
                </View>
                <Text className='flex-1 text-sm font-medium text-neutral-700'>{label}</Text>
                <View className='flex-row items-center gap-2'>
                    <View className={`h-2 w-2 rounded-full ${dot}`} />
                    <Text className='text-base font-bold text-neutral-900'>{isLoading ? '–' : value}</Text>
                </View>
            </View>
            {showDivider && <View className='mx-5 h-[1px] bg-neutral-50' />}
        </>
    )
}