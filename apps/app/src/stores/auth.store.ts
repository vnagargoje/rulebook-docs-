import { create } from 'zustand'
import { createSelectors } from '@/lib/utils'
import { getItem, removeItem, setItem } from '@/lib/storage'
import type { AuthState, AuthToken } from '@/types/auth/auth.types'

const AUTH_TOKEN_STORAGE_KEY = 'auth_token'

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

const _useAuthStore = create<AuthState>((set) => ({
    status: 'idle',
    token: null,
    signIn: (token) => {
        persistToken(token)
        set({ status: 'signIn', token })
    },
    signOut: () => {
        persistToken(null)
        set({ status: 'signOut', token: null })
    },
    hydrate: () => {
        const token = getAuthToken()
        set({
            status: token ? 'signIn' : 'signOut',
            token,
        })
    },
}))

export const useAuthStore = createSelectors(_useAuthStore)
export const signOut = () => _useAuthStore.getState().signOut()
export const signIn = (token: AuthToken) => _useAuthStore.getState().signIn(token)
export const hydrateAuth = () => _useAuthStore.getState().hydrate()
