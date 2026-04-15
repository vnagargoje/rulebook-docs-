import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import type { CustomerQuickActionCardProps } from './customer-card.types'
import { Text, View } from '@/components/ui'

export function CustomerQuickActionCard({ action, width }: CustomerQuickActionCardProps) {
    return (
        <View
            style={{ width }}
            className='rounded-3xl border border-neutral-200 bg-white p-4'>
            <View className={`mb-4 h-12 w-12 items-center justify-center rounded-2xl ${action.accentClassName}`}>
                <MaterialCommunityIcons
                    name={action.iconName}
                    size={22}
                    color={action.iconColor}
                />
            </View>
            <Text className='text-lg font-semibold text-neutral-900'>{action.title}</Text>
            <Text className='mt-2 text-sm leading-6 text-neutral-500'>{action.description}</Text>
        </View>
    )
}
