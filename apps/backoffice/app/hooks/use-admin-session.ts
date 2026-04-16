import { useEffect, useState } from 'react'
import { getAuthFromStorage } from '~/lib/token'
import type { AdminSession } from '~/types/admin'
import { useHydrated } from './use-hydrated'

export function useAdminSession() {
    const hydrated = useHydrated()
    const [session, setSession] = useState<AdminSession | null>(() => {
        if (typeof window === 'undefined') return null
        const auth = getAuthFromStorage()
        if (!auth) return null
        return {
            adminId: auth.user.id,
            email: auth.user.email,
            name: auth.user.email.split('@')[0], // Fallback name
            role: 'SYSTEM_ADMIN', // Mapping assume for now
        }
    })

    useEffect(() => {
        if (hydrated) {
            const auth = getAuthFromStorage()
            if (auth) {
                setSession({
                    adminId: auth.user.id,
                    email: auth.user.email,
                    name: auth.user.email.split('@')[0],
                    role: 'SYSTEM_ADMIN',
                })
            } else {
                setSession(null)
            }
        }
    }, [hydrated])

    return { hydrated, session, setSession }
}
