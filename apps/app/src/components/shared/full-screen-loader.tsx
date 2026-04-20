import { ActivityIndicator, View } from 'react-native'

import colors from '@/components/ui/colors'

export function FullScreenLoader() {
    return (
        <View className='flex-1 items-center justify-center bg-white'>
            <ActivityIndicator
                size='large'
                color={colors.primary[600]}
            />
        </View>
    )
}
