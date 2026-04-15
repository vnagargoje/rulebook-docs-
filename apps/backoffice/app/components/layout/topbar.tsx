import { useLocation } from 'react-router'
import type { AdminSession } from '~/types/admin'
import { NAVIGATION_ITEMS } from './navigation'

interface TopbarProps {
    session: AdminSession
}

export function Topbar({ session }: TopbarProps) {
    const location = useLocation()
    
    const currentItem =
        NAVIGATION_ITEMS.find((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)) ??
        NAVIGATION_ITEMS[0]

    return (
        <header className='flex h-[72px] shrink-0 items-center justify-between border-b border-border/60 bg-white/80 px-8 backdrop-blur-md z-40 relative isolate'>
            <div className='flex flex-col overflow-hidden'>
                <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 truncate'>
                    Operations
                </span>
                <h1 className='font-display text-xl font-bold tracking-tight text-foreground/90 truncate'>
                    {currentItem.label}
                </h1>
            </div>
            
            <div className='flex shrink-0 items-center gap-4'>
                <div className='hidden items-center gap-2 rounded-xl border border-border/50 bg-white/50 px-4 py-1.5 text-[11px] font-bold text-muted-foreground shadow-sm sm:flex uppercase tracking-wider'>
                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-sm shadow-green-200" />
                    {session.role.replace(/_/g, ' ')}
                </div>
            </div>
        </header>
    )
}
