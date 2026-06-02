import { Redirect } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useState } from 'react'

import { WelcomeScreen } from '@/components/shared/welcome-screen'
import { useAuthStore } from '@/stores/auth.store'
import type { UserRole } from '@/types/auth/auth.types'

const ROLE_ROUTES: Record<UserRole, any> = {
    customer: '/customer',
    swap_manager: '/swap-manager',
    hub_manager: '/hub-manager',
}

export default function Index() {
    const status = useAuthStore.use.status()
    const role = useAuthStore.use.user().role
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        let isMounted = true
        if (status !== 'idle') {
            // Hide splash screen immediately so we can see the animated WelcomeScreen
            void SplashScreen.hideAsync()
            
            // Ensure the welcome screen animation has time to play
            setTimeout(() => {
                if (isMounted) {
                    setIsReady(true)
                }
            }, 1500)
        }
        return () => {
            isMounted = false
        }
    }, [status])

    if (!isReady) {
        return <WelcomeScreen />
    }

    if (status === 'signOut') {
        return (
            <>
                <WelcomeScreen />
                <Redirect href='/customer' />
            </>
        )
    }

    const route = ROLE_ROUTES[role ?? 'customer']
    return (
        <>
            <WelcomeScreen />
            <Redirect href={route} />
        </>
    )
}
