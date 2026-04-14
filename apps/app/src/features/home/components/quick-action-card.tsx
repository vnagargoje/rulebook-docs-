import type { HomeQuickAction } from '../home.types'
import { Text, View } from '@/components/ui'

type QuickActionCardProps = {
    action: HomeQuickAction
    width: number | `${number}%`
}

export function QuickActionCard( { action, width }: QuickActionCardProps ) {
    return (
        <View
            style={{ width }}
            className='rounded-3xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900'>
            <View className={`mb-4 h-12 w-12 items-center justify-center rounded-2xl ${action.accentClassName}`}>
                <Text className='text-sm font-bold'>{action.iconLabel}</Text>
            </View>
            <Text className='text-lg font-semibold text-neutral-900 dark:text-neutral-50'>{action.title}</Text>
            <Text className='mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400'>{action.description}</Text>
        </View>
    )
}
