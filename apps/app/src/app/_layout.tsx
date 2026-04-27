import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

import { ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import * as React from 'react'
import { Toaster } from 'sonner-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { hydrateAuth } from '@/stores/auth.store'
import { useThemeConfig } from '@/components/ui/use-theme-config'
import { FocusAwareStatusBar } from '@/components/ui'

import { APIProvider } from '@/lib/api'
import { loadSelectedTheme } from '@/lib/hooks/use-selected-theme'
// Import  global CSS file
import '../global.css'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export { ErrorBoundary } from 'expo-router'

// eslint-disable-next-line react-refresh/only-export-components
export const unstable_settings = {
    initialRouteName: 'index',
}

hydrateAuth()
loadSelectedTheme()
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 500,
    fade: true,
})

export default function RootLayout() {
    return (
        <Providers>
            <Stack>
                <Stack.Screen
                    name='index'
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='customer'
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='swap-manager'
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='hub-manager'
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='auth'
                    options={{ headerShown: false }}
                />
            </Stack>
        </Providers>
    )
}

function Providers({ children }: { children: React.ReactNode }) {
    const theme = useThemeConfig()
    return (
        <GestureHandlerRootView className='flex-1'>
            <SafeAreaProvider>
                <KeyboardProvider>
                    <ThemeProvider value={theme}>
                        <FocusAwareStatusBar />
                        <APIProvider>
                            <BottomSheetModalProvider>
                                {children}
                                <Toaster />
                            </BottomSheetModalProvider>
                        </APIProvider>
                    </ThemeProvider>
                </KeyboardProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}
