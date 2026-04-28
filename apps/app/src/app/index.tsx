import { Redirect } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useState } from 'react'

import { FullScreenLoader } from '@/components/shared/full-screen-loader'
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
        if (status !== 'idle') {
            setIsReady(true)
            void SplashScreen.hideAsync()
        }
    }, [status])

    if (!isReady) {
        return <FullScreenLoader />
    }

    if (status === 'signOut') {
        return <Redirect href='/customer' />
    }

    const route = ROLE_ROUTES[role ?? 'customer']
    return <Redirect href={route} />
}
