import { jwtDecode } from 'jwt-decode'

import { getItem, removeItem, setItem } from '@/lib/storage'
import type { AuthToken, JwtPayload, UserRole } from '@/types/auth/auth.types'

const TOKEN_KEY = 'auth_token'

const VALID_ROLES: UserRole[] = ['customer', 'swap_manager', 'hub_manager']

export function getToken(): AuthToken | null {
    return getItem<AuthToken>(TOKEN_KEY)
}

export function setToken(value: AuthToken) {
    setItem<AuthToken>(TOKEN_KEY, value)
}

export function removeToken() {
    removeItem(TOKEN_KEY)
}

export function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwtDecode<JwtPayload>(token)
        if (!decoded.exp) return true
        return Date.now() >= decoded.exp * 1000
    } catch {
        return true
    }
}

export function getUserId(): string | null {
    const token = getToken()?.access
    if (!token) return null

    try {
        const decoded = jwtDecode<JwtPayload>(token)
        return decoded.id ?? decoded.sub ?? null
    } catch {
        return null
    }
}

export function getUserRole(): UserRole | null {
    const token = getToken()?.access
    if (!token) return null

    try {
        const decoded = jwtDecode<JwtPayload>(token)
        const roles = decoded.roles ?? []

        for (const role of roles) {
            if (VALID_ROLES.includes(role as UserRole)) {
                return role as UserRole
            }
        }

        return 'customer'
    } catch {
        return null
    }
}
