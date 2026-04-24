import type { Href } from 'expo-router'
import { Redirect } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'

import { FullScreenLoader } from '@/components/shared/full-screen-loader'
import { useIsAuthenticated } from '@/queries/auth.query'
import type { UserRole } from '@/types/auth/auth.types'

const ROLE_ROUTES: Record<UserRole, Href> = {
    customer: '/customer',
    swap_manager: '/swap-manager',
    hub_manager: '/hub-manager',
} as const

export default function Index() {
    const { data, isLoading } = useIsAuthenticated()

    if (isLoading) {
        return <FullScreenLoader />
    }

    if (!data?.authenticated) {
        void SplashScreen.hideAsync()
        return <Redirect href='/customer' />
    }

    const route = ROLE_ROUTES[data.role ?? 'customer']

    void SplashScreen.hideAsync()
    return <Redirect href={route} />
}
