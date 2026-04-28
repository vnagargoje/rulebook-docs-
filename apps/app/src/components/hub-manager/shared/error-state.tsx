import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'

import { Button, SafeAreaView, Text, View } from '@/components/ui'

interface ErrorStateProps {
    title: string
    message: string
    primaryLabel: string
    secondaryLabel?: string
    onPrimary: () => void
    onSecondary?: () => void
}

export function ErrorState({
    title,
    message,
    primaryLabel,
    secondaryLabel,
    onPrimary,
    onSecondary,
}: ErrorStateProps) {
    return (
        <SafeAreaView
            className='flex-1 items-center justify-center bg-white px-8'
            edges={['top']}>
            <View className='h-24 w-24 items-center justify-center rounded-full bg-red-50'>
                <MaterialCommunityIcons
                    name='alert-circle'
                    size={56}
                    color='#DC2626'
                />
            </View>
            <Text className='mt-6 text-2xl font-bold text-neutral-900'>{title}</Text>
            <Text className='mt-2 text-center text-sm leading-6 text-neutral-500'>{message}</Text>
            <Button
                label={primaryLabel}
                onPress={onPrimary}
                className='mt-10 w-full'
            />
            {secondaryLabel && onSecondary && (
                <Pressable
                    onPress={onSecondary}
                    className='mt-4'>
                    <Text className='text-sm font-semibold text-neutral-500'>{secondaryLabel}</Text>
                </Pressable>
            )}
        </SafeAreaView>
    )
}
