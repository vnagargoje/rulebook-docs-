import { SplashScreen, Tabs } from 'expo-router'
import * as React from 'react'
import { useCallback, useEffect } from 'react'

import { Home as HomeIcon, Settings as SettingsIcon, Style as StyleIcon } from '@/components/ui/icons'

export default function TabLayout() {
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
        <Tabs>
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <HomeIcon color={color} />,
                    tabBarButtonTestID: 'home-tab',
                }}
            />

            <Tabs.Screen
                name='style'
                options={{
                    title: 'Style',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <StyleIcon color={color} />,
                    tabBarButtonTestID: 'style-tab',
                }}
            />
            <Tabs.Screen
                name='settings'
                options={{
                    title: 'Settings',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
                    tabBarButtonTestID: 'settings-tab',
                }}
            />
        </Tabs>
    )
}
