import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Text, View } from '@/components/ui'

interface EmptyStateProps {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']
    message: string
}

export function EmptyState({ icon, message }: EmptyStateProps) {
    return (
        <View className='flex-row items-center gap-2 py-1'>
            <MaterialCommunityIcons name={icon} size={16} color='#D1D5DB' />
            <Text className='text-[13px] text-neutral-300'>{message}</Text>
        </View>
    )
}
