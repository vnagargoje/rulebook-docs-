import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'

import { Button, SafeAreaView, Text, View } from '@/components/ui'

interface Props {
    message: string | null
    onRetry: () => void
    onCancel: () => void
}

export const ErrorState = ({ message, onRetry, onCancel }: Props) => {
    return (
        <SafeAreaView className='flex-1 bg-white items-center justify-center px-10'>
            <View className='h-20 w-20 rounded-full bg-red-50 items-center justify-center mb-6'>
                <MaterialCommunityIcons
                    name='alert-circle-outline'
                    size={48}
                    color='#ef4444'
                />
            </View>
            <Text className='text-2xl font-bold text-neutral-900 text-center'>Process Failed</Text>
            <Text className='mt-2 text-neutral-500 text-center leading-relaxed'>
                {message || 'Something went wrong during the swap process.'}
            </Text>
            <View className='mt-10 w-full gap-3'>
                <Button
                    label='Try Again'
                    onPress={onRetry}
                />
                <Button
                    variant='outline'
                    label='Cancel'
                    onPress={onCancel}
                />
            </View>
        </SafeAreaView>
    )
}
