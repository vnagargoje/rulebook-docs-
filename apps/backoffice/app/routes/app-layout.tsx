import { Outlet, useNavigate, useLocation } from 'react-router'
import { useEffect } from 'react'
import { AdminShell } from '~/components/layout/admin-shell'
import { useAuth } from '~/lib/auth-context'

export async function clientLoader() {
    return null
}

export default function AppLayout() {
    const { isAuthenticated, user, isLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login', {
                replace: true,
                state: { from: location.pathname },
            })
        }
    }, [isAuthenticated, isLoading, navigate, location.pathname])

    if (isLoading) {
        return <div className='mx-auto max-w-lg px-6 py-20 text-center text-muted-foreground'>Preparing admin workspace…</div>
    }

    if (!isAuthenticated || !user) {
        return null
    }

    return (
        <AdminShell session={{
            adminId: user.id,
            email: user.email,
            name: user.email.split('@')[0],
            role: 'SYSTEM_ADMIN' 
        }}>
            <Outlet />
        </AdminShell>
    )
}
