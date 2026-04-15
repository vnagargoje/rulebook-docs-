const AUTH_STORAGE_KEY = 'yugo_auth_data'

export interface AuthData {
    accessToken: string
    refreshToken: string
    user: {
        id: string
        email: string
        roles: string[]
    }
}

export function getAuthFromStorage(): AuthData | null {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!data) return null
    try {
        return JSON.parse(data)
    } catch {
        return null
    }
}

export function setAuthToStorage(data: AuthData): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
}

export function removeAuthFromStorage(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(AUTH_STORAGE_KEY)
}
