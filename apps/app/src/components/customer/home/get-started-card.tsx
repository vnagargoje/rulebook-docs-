import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Pressable, Text, View } from '@/components/ui'

type Props = {
    onPress: () => void
}

export function GetStartedCard({ onPress }: Props) {
    return (
        <View className='overflow-hidden rounded-3xl border border-primary-100 bg-primary-50 p-6'>
            <View className='h-14 w-14 items-center justify-center rounded-2xl bg-primary-100'>
                <MaterialCommunityIcons name='lightning-bolt' size={26} color='#1D4ED8' />
            </View>
            <Text className='mt-4 text-2xl font-bold text-neutral-900'>Ready to ride?</Text>
            <Text className='mt-2 text-sm leading-5 text-neutral-600'>
                Pick a plan, book your vehicle, and collect it at your nearest Yugo station.
            </Text>
            <Pressable onPress={onPress} className='mt-5'>
                <View className='items-center rounded-2xl bg-primary-600 py-3.5'>
                    <Text className='text-base font-bold text-white'>Browse Plans</Text>
                </View>
            </Pressable>
        </View>
    )
}
