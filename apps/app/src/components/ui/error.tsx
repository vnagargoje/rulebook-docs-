import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'
import { Button, Text } from '@/components/ui'

interface Props {
    title?: string
    description?: string
    onRetry?: () => void
}

export function ErrorView({
    title = 'Something went wrong',
    description = 'An unexpected error occurred. Please try again.',
    onRetry,
}: Props) {
    return (
        <View className='flex-1 items-center justify-center px-8 gap-3'>
            <View className='h-16 w-16 items-center justify-center rounded-full bg-red-50'>
                <MaterialCommunityIcons
                    name='alert-circle-outline'
                    size={30}
                    color='#EF4444'
                />
            </View>
            <Text className='text-center text-base font-semibold text-neutral-700'>{title}</Text>
            <Text className='text-center text-sm text-neutral-400'>{description}</Text>
            {onRetry && (
                <Button
                    label='Try Again'
                    onPress={onRetry}
                    className='mt-2 h-11 rounded-2xl border border-red-200 bg-red-50 px-6'
                    textClassName='text-sm font-semibold text-red-600'
                />
            )}
        </View>
    )
}
