import { ActivityIndicator, View } from 'react-native'
import { Text } from '@/components/ui'

interface Props {
    isFetchingNextPage: boolean
    hasNextPage: boolean
}

export function SwapListFooter({ isFetchingNextPage, hasNextPage }: Props) {
    if (isFetchingNextPage) {
        return (
            <View className='items-center py-6'>
                <ActivityIndicator
                    size='small'
                    color='#9CA3AF'
                />
            </View>
        )
    }

    if (!hasNextPage) {
        return (
            <View className='items-center py-6'>
                <Text className='text-xs text-neutral-400'>All swaps loaded</Text>
            </View>
        )
    }

    return null
}
