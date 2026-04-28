import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'

import { Button, SafeAreaView, Text, View } from '@/components/ui'

interface Props {
    onDone: () => void
}

export const SuccessState = ({ onDone }: Props) => {
    return (
        <SafeAreaView className='flex-1 bg-white items-center justify-center px-10'>
            <View className='h-20 w-20 rounded-full bg-green-50 items-center justify-center mb-6'>
                <MaterialCommunityIcons
                    name='check-circle-outline'
                    size={48}
                    color='#22c55e'
                />
            </View>
            <Text className='text-2xl font-bold text-neutral-900 text-center'>Swap Successful!</Text>
            <Text className='mt-2 text-neutral-500 text-center leading-relaxed'>
                The battery swap has been processed correctly. The customer&apos;s plan has been updated.
            </Text>
            <Button
                className='mt-10 w-full'
                label='Back to Dashboard'
                onPress={onDone}
            />
        </SafeAreaView>
    )
}
