import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'

import { Button, SafeAreaView, Text, View } from '@/components/ui'

interface SuccessStateProps {
    title: string
    message: string
    primaryLabel: string
    secondaryLabel?: string
    onPrimary: () => void
    onSecondary?: () => void
    iconColor?: string
}

export function SuccessState({
    title,
    message,
    primaryLabel,
    secondaryLabel,
    onPrimary,
    onSecondary,
    iconColor = '#22C55E',
}: SuccessStateProps) {
    return (
        <SafeAreaView
            className='flex-1 items-center justify-center bg-white px-8'
            edges={['top']}>
            <View className='h-24 w-24 items-center justify-center rounded-full bg-green-50'>
                <MaterialCommunityIcons
                    name='check-circle'
                    size={56}
                    color={iconColor}
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
                    <Text className='text-sm font-semibold text-primary-600'>{secondaryLabel}</Text>
                </Pressable>
            )}
        </SafeAreaView>
    )
}
