import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { SplashScreen, Tabs } from 'expo-router'
import { useCallback, useEffect } from 'react'

import { colors } from '@/components/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HubManagerTabsLayout() {
    const insets = useSafeAreaInsets()

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
                    height: 60 + insets.bottom,
                    paddingTop: 10,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
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
                }}
            />
            <Tabs.Screen
                name='inventory'
                options={{
                    title: 'Inventory',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='battery-charging-outline'
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='batteries'
                options={{
                    title: 'Batteries',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='battery-heart-outline'
                            size={22}
                            color={color}
                        />
                    ),
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
                }}
            />
        </Tabs>
    )
}
