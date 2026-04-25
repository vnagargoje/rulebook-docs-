import { Stack } from 'expo-router'

import { colors } from '@/components/ui'

export default function () {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.white },
            }}>
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='execute-swap' />
        </Stack>
    )
}
