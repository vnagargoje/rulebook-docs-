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
            <Stack.Screen
                name='battery/[id]'
                options={{
                    headerShown: true,
                    title: 'Battery Detail',
                    headerBackTitle: 'Back',
                    headerTintColor: colors.primary[600],
                    headerTitleStyle: { color: colors.neutral[900], fontWeight: '600' },
                    headerStyle: { backgroundColor: colors.white },
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name='profile/edit'
                options={{
                    headerShown: true,
                    title: 'Edit Profile',
                    headerBackTitle: 'Back',
                    headerTintColor: colors.primary[600],
                    headerTitleStyle: { color: colors.neutral[900], fontWeight: '600' },
                    headerStyle: { backgroundColor: colors.white },
                    headerShadowVisible: false,
                }}
            />
        </Stack>
    )
}
