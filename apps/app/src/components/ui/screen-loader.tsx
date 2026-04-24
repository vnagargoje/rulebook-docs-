import { ActivityIndicator, Text, View } from 'react-native'

type Props = {
    label?: string
}

export function ScreenLoader({ label = 'Loading...' }: Props) {
    return (
        <View className='flex-1 items-center justify-center bg-background'>
            <ActivityIndicator size='large' />
            <Text className='mt-3 text-sm text-neutral-500'>{label}</Text>
        </View>
    )
}
