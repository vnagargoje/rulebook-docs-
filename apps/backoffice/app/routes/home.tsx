import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { useAdminSession } from '~/hooks'

export default function Home() {
    const navigate = useNavigate()
    const { hydrated, session } = useAdminSession()

    useEffect(() => {
        if (!hydrated) {
            return
        }

        navigate(session ? '/dashboard' : '/login', { replace: true })
    }, [hydrated, navigate, session])

    return <div className='rounded-3xl border border-border/70 bg-card px-6 py-12 text-center text-muted-foreground'>Loading workspace…</div>
}
