import { Stack } from 'expo-router'

import { colors } from '@/components/ui'

export default function HubManagerLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.white },
            }}>
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='battery-inward' />
            <Stack.Screen name='battery-outward' />
        </Stack>
    )
}
