import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { SplashScreen, Tabs } from 'expo-router'
import { useCallback, useEffect } from 'react'

import { colors } from '@/components/ui'

export default function CustomerLayout() {
    const hideSplash = useCallback(async () => {
        await SplashScreen.hideAsync()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            hideSplash()
        }, 1000)

        return () => clearTimeout(timer)
    }, [hideSplash])

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary[600],
                tabBarInactiveTintColor: colors.neutral[400],
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopColor: colors.primary[100],
                    height: 68,
                    paddingTop: 8,
                    paddingBottom: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='home-outline'
                            size={22}
                            color={color}
                        />
                    ),
                    tabBarButtonTestID: 'customer-home-tab',
                }}
            />
            <Tabs.Screen
                name='booking'
                options={{
                    title: 'Booking',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='calendar-check-outline'
                            size={22}
                            color={color}
                        />
                    ),
                    tabBarButtonTestID: 'customer-booking-tab',
                }}
            />
            <Tabs.Screen
                name='help'
                options={{
                    title: 'Help',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='lifebuoy'
                            size={22}
                            color={color}
                        />
                    ),
                    tabBarButtonTestID: 'customer-help-tab',
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='account-outline'
                            size={22}
                            color={color}
                        />
                    ),
                    tabBarButtonTestID: 'customer-profile-tab',
                }}
            />
        </Tabs>
    )
}
