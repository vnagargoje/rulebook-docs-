import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'
import { Text } from '@/components/ui'

interface Props {
    icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name']
    title: string
    description?: string
    action?: React.ReactNode
}

export function EmptyState({ icon = 'inbox-outline', title, description, action }: Props) {
    return (
        <View className='flex-1 items-center justify-center px-8 py-20 gap-3'>
            <View className='h-16 w-16 items-center justify-center rounded-full bg-neutral-100'>
                <MaterialCommunityIcons
                    name={icon}
                    size={30}
                    color='#9CA3AF'
                />
            </View>
            <Text className='text-center text-base font-semibold text-neutral-500'>{title}</Text>
            {description && <Text className='text-center text-sm text-neutral-400'>{description}</Text>}
            {action && <View className='mt-2'>{action}</View>}
        </View>
    )
}
