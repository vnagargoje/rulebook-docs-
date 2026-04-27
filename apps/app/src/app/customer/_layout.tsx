import { Stack } from 'expo-router'

import { colors } from '@/components/ui'

export default function CustomerLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.white },
            }}>
            <Stack.Screen name='(tabs)' />
            <Stack.Screen
                name='plan/[id]'
                options={{
                    headerShown: true,
                    title: 'Plan Details',
                    headerBackTitle: 'Back',
                    headerTintColor: colors.primary[600],
                    headerTitleStyle: { color: colors.neutral[900], fontWeight: '600' },
                    headerStyle: { backgroundColor: colors.white },
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name='select-station'
                options={{
                    headerShown: true,
                    title: 'Select Station',
                    headerBackTitle: 'Back',
                    headerTintColor: colors.primary[600],
                    headerTitleStyle: { color: colors.neutral[900], fontWeight: '600' },
                    headerStyle: { backgroundColor: colors.white },
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name='confirm-booking'
                options={{
                    headerShown: true,
                    title: 'Confirm Booking',
                    headerBackTitle: 'Back',
                    headerTintColor: colors.primary[600],
                    headerTitleStyle: { color: colors.neutral[900], fontWeight: '600' },
                    headerStyle: { backgroundColor: colors.white },
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name='booking-success'
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name='confirm-topup'
                options={{
                    headerShown: true,
                    title: 'Confirm Top-Up',
                    headerBackTitle: 'Back',
                    headerTintColor: colors.primary[600],
                    headerTitleStyle: { color: colors.neutral[900], fontWeight: '600' },
                    headerStyle: { backgroundColor: colors.white },
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name='topup-success'
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name='booking/[id]'
                options={{
                    headerShown: true,
                    title: 'Booking Details',
                    headerBackTitle: 'Back',
                    headerTintColor: colors.primary[600],
                    headerTitleStyle: { color: colors.neutral[900], fontWeight: '600' },
                    headerStyle: { backgroundColor: colors.white },
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name='station/[id]'
                options={{
                    headerShown: false,
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
