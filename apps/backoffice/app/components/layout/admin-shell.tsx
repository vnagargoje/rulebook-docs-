import { useState } from 'react'
import type { ReactNode } from 'react'

import type { AdminSession } from '~/types/admin'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

interface AdminShellProps {
    session: AdminSession
    children: ReactNode
}

export function AdminShell({ session, children }: AdminShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className='flex h-screen w-full overflow-hidden bg-background text-foreground isolate shrink-0'>
            <Sidebar 
                session={session} 
                isCollapsed={isCollapsed} 
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
            />
            <div className='flex flex-1 flex-col overflow-hidden min-w-0 bg-[#f8f9fb] relative'>
                <Topbar session={session} />
                <main className='flex-1 overflow-y-auto px-8 py-8 custom-scrollbar overscroll-contain relative isolate z-10'>
                    <div className='mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700 pb-12'>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
