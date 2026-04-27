import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'

import { getItem, removeItem, setItem } from '@/lib/storage'
import { createSelectors } from '@/lib/utils'
import type { AuthState, AuthToken, JwtPayload, UserRole } from '@/types/auth/auth.types'

const AUTH_TOKEN_STORAGE_KEY = 'auth_token'
const VALID_ROLES: UserRole[] = ['customer', 'swap_manager', 'hub_manager']

const persistToken = (token: AuthToken | null) => {
    if (token) {
        setItem(AUTH_TOKEN_STORAGE_KEY, token)
        return
    }

    removeItem(AUTH_TOKEN_STORAGE_KEY)
}

export function getAuthToken() {
    return getItem<AuthToken>(AUTH_TOKEN_STORAGE_KEY)
}

function decodeUser(token: string | null) {
    if (!token) return { id: null, role: null }

    try {
        const decoded = jwtDecode<JwtPayload>(token)
        const id = decoded.id ?? decoded.sub ?? null
        const roles = decoded.roles ?? []
        let role: UserRole | null = null

        for (const r of roles) {
            if (VALID_ROLES.includes(r as UserRole)) {
                role = r as UserRole
                break
            }
        }

        if (!role && roles.length > 0) {
            role = 'customer'
        }

        return { id, role }
    } catch {
        return { id: null, role: null }
    }
}

const _useAuthStore = create<AuthState>((set) => ({
    status: 'idle',
    token: null,
    user: { id: null, role: null },
    signIn: (token) => {
        persistToken(token)
        const { id, role } = decodeUser(token.access)
        set({ status: 'signIn', token, user: { id, role } })
    },
    signOut: () => {
        persistToken(null)
        set({ status: 'signOut', token: null, user: { id: null, role: null } })
    },
    hydrate: () => {
        const token = getAuthToken()
        const { id, role } = decodeUser(token?.access ?? null)
        set({
            status: token ? 'signIn' : 'signOut',
            token,
            user: { id, role },
        })
    },
}))

export const useAuthStore = createSelectors(_useAuthStore)
export const signOut = () => _useAuthStore.getState().signOut()
export const signIn = (token: AuthToken) => _useAuthStore.getState().signIn(token)
export const hydrateAuth = () => _useAuthStore.getState().hydrate()
