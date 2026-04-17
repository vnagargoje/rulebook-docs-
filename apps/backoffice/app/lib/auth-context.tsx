import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getAuthFromStorage, setAuthToStorage, removeAuthFromStorage, type AuthData } from './token'
import { canAccessAdminPanel } from './ability'

interface AuthContextType {
    isAuthenticated: boolean
    user: AuthData['user'] | null
    login: (data: AuthData) => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthData['user'] | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const auth = getAuthFromStorage()
        if (auth && canAccessAdminPanel(auth.user.roles)) {
            setUser(auth.user)
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [])

    const login = (data: AuthData) => {
        setAuthToStorage(data)
        setUser(data.user)
        setIsAuthenticated(true)
    }

    const logout = () => {
        removeAuthFromStorage()
        setUser(null)
        setIsAuthenticated(false)
        window.location.href = '/login'
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
