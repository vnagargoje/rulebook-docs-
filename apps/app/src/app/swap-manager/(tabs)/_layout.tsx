import { colors } from '@/components/ui'
import { FontAwesome } from '@expo/vector-icons'
import Entypo from '@expo/vector-icons/Entypo'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { SplashScreen, Tabs } from 'expo-router'
import { useCallback, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function () {
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
                    tabBarButtonTestID: 'swap-manager-home-tab',
                }}
            />
            <Tabs.Screen
                name='batteries'
                options={{
                    title: 'Batteries',
                    tabBarIcon: ({ color }) => (
                        <Entypo
                            name='battery'
                            size={24}
                            color={color}
                        />
                    ),
                    tabBarButtonTestID: 'swap-manager-batteries-tab',
                }}
            />
            <Tabs.Screen
                name='history'
                options={{
                    title: 'History',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            name='history'
                            size={24}
                            color={color}
                        />
                    ),
                    tabBarButtonTestID: 'swap-manager-history-tab',
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
                    tabBarButtonTestID: 'swap-manager-profile-tab',
                }}
            />
        </Tabs>
    )
}
