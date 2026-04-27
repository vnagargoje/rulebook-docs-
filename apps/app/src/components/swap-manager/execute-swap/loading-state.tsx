import React from 'react'

import { Text, View } from '@/components/ui'

interface Props {
    message: string
}

export const LoadingState = ({ message }: Props) => {
    return (
        <View className='flex-1 items-center justify-center p-10 bg-neutral-50'>
            <View className='h-12 w-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin' />
            <Text className='mt-4 text-neutral-500 font-medium'>{message}</Text>
        </View>
    )
}
