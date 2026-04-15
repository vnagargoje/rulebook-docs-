import { SplashScreen, Tabs } from 'expo-router'
import * as React from 'react'
import { useCallback, useEffect } from 'react'

import { colors } from '@/components/ui'
import {
    Booking as BookingIcon,
    Home as HomeIcon,
    Profile as ProfileIcon,
    Support as SupportIcon,
} from '@/components/ui/icons'

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
                    tabBarIcon: ({ color }) => <HomeIcon color={color} />,
                    tabBarButtonTestID: 'customer-home-tab',
                }}
            />
            <Tabs.Screen
                name='booking'
                options={{
                    title: 'Booking',
                    tabBarIcon: ({ color }) => <BookingIcon color={color} />,
                    tabBarButtonTestID: 'customer-booking-tab',
                }}
            />
            <Tabs.Screen
                name='support'
                options={{
                    title: 'Support',
                    tabBarIcon: ({ color }) => <SupportIcon color={color} />,
                    tabBarButtonTestID: 'customer-support-tab',
                }}
            />
            <Tabs.Screen
                name='settings'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
                    tabBarButtonTestID: 'customer-profile-tab',
                }}
            />
        </Tabs>
    )
}
