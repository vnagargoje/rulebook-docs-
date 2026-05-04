import { Stack } from 'expo-router'
import { colors } from '@/components/ui'

export default function KycLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerBackTitle: 'Back',
                headerTintColor: colors.primary[600],
                headerTitleStyle: { color: colors.neutral[900], fontWeight: '600' },
                headerStyle: { backgroundColor: colors.white },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.white },
            }}>
            <Stack.Screen
                name='aadhaar'
                options={{ title: 'Aadhaar Verification', gestureEnabled: false, headerBackVisible: false }}
            />
            <Stack.Screen name='pan' options={{ title: 'PAN Verification' }} />
            <Stack.Screen name='license' options={{ title: 'Driving License' }} />
            <Stack.Screen name='profile' options={{ title: 'Confirm Your Profile' }} />
            <Stack.Screen name='address' options={{ title: 'Address Details' }} />
            <Stack.Screen name='emergency' options={{ title: 'Emergency Contact' }} />
        </Stack>
    )
}
