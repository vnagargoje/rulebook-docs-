import {
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarRightCollapse,
    IconLogout,
    IconRouteSquare,
    IconChevronDown,
    IconChevronRight,
} from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router'
import { cn } from '~/lib/utils'

import { Button } from '~/components/ui/button'
import { useAuth } from '~/lib/auth-context'
import type { AdminSession } from '~/types/admin'
import { NAVIGATION_ITEMS } from './navigation'

interface SidebarProps {
    session: AdminSession
    isCollapsed: boolean
    onToggleCollapse: () => void
}

export function Sidebar({ session, isCollapsed, onToggleCollapse }: SidebarProps) {
    const location = useLocation()
    const { logout } = useAuth()
    const [openMenus, setOpenMenus] = useState<string[]>([])

    useEffect(() => {
        NAVIGATION_ITEMS.forEach(item => {
            if (item.children?.some(child => location.pathname === child.to || location.pathname.startsWith(child.to))) {
                if (!openMenus.includes(item.label)) {
                    setOpenMenus(prev => [...prev, item.label])
                }
            }
        })
    }, [location.pathname])

    const toggleMenu = (label: string) => {
        setOpenMenus(prev => 
            prev.includes(label) 
                ? prev.filter(m => m !== label) 
                : [...prev, label]
        )
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <aside className={cn(
            'relative flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 shadow-sm shrink-0 overscroll-none',
            isCollapsed ? 'w-20' : 'w-[280px]'
        )}>
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute -right-4 top-10 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted z-50"
                onClick={onToggleCollapse}
            >
                {isCollapsed ? <IconLayoutSidebarRightCollapse size={16} /> : <IconLayoutSidebarLeftCollapse size={16} />}
            </Button>

            <div className='flex h-[72px] shrink-0 items-center px-6'>
                <NavLink to='/dashboard' className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20'>
                        <IconRouteSquare size={22} />
                    </div>
                    {!isCollapsed && (
                        <div className='flex flex-col animate-in fade-in slide-in-from-left-2 duration-300 overflow-hidden'>
                            <span className='font-display text-xl font-bold leading-none tracking-tight'>YUGO</span>
                            <span className='mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/50'>Admin Panel</span>
                        </div>
                    )}
                </NavLink>
            </div>

            <div className='flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar select-none'>
                <nav className='grid gap-1 px-3'>
                    {NAVIGATION_ITEMS.map((item) => {
                        const Icon = item.icon
                        const hasChildren = item.children && item.children.length > 0
                        const isMenuOpen = openMenus.includes(item.label)
                        
                        const isParentActive = item.to 
                            ? (location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to)))
                            : item.children?.some(child => location.pathname === child.to || location.pathname.startsWith(child.to))

                        if (hasChildren) {
                            return (
                                <div key={item.label} className="flex flex-col gap-1">
                                    <button
                                        onClick={() => toggleMenu(item.label)}
                                        title={isCollapsed ? item.label : undefined}
                                        className={cn(
                                            'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 outline-none w-full text-left',
                                            isParentActive && !isMenuOpen
                                                ? 'bg-primary/10 text-primary' 
                                                : 'hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                        )}
                                    >
                                        <div className={cn(
                                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                                            isParentActive ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/40 text-sidebar-foreground/70 group-hover:bg-muted/60'
                                        )}>
                                            <Icon size={18} stroke={isParentActive ? 2.5 : 2} />
                                        </div>
                                        {!isCollapsed && (
                                            <>
                                                <div className='flex flex-1 flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300'>
                                                    <span className='truncate text-sm font-bold tracking-tight'>{item.label}</span>
                                                    <span className={cn(
                                                        'truncate text-[10px] leading-tight font-medium',
                                                        isParentActive ? 'text-primary' : 'text-sidebar-foreground/70'
                                                    )}>
                                                        {item.description}
                                                    </span>
                                                </div>
                                                {isMenuOpen ? <IconChevronDown size={14} className="text-sidebar-foreground/40" /> : <IconChevronRight size={14} className="text-sidebar-foreground/40" />}
                                            </>
                                        )}
                                    </button>
                                    
                                    {!isCollapsed && isMenuOpen && (
                                        <div className="ml-7 flex flex-col gap-1 border-l border-sidebar-border/50 pl-4 py-1.5 animate-in slide-in-from-top-2 duration-200">
                                            {item.children?.map((child) => {
                                                const isChildActive = location.pathname === child.to || location.pathname.startsWith(child.to)
                                                return (
                                                    <NavLink
                                                        key={child.to}
                                                        to={child.to}
                                                        className={cn(
                                                            'flex flex-col rounded-lg px-3 py-1.5 transition-all duration-200 outline-none',
                                                            isChildActive 
                                                                ? 'bg-primary text-primary-foreground shadow-sm font-semibold' 
                                                                : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                                                        )}
                                                    >
                                                        <span className="text-[13px]">{child.label}</span>
                                                        {child.description && (
                                                            <span className={cn(
                                                                "text-[9px] leading-tight font-medium",
                                                                isChildActive ? "text-white/80" : "text-sidebar-foreground/50"
                                                            )}>{child.description}</span>
                                                        )}
                                                    </NavLink>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        const isActive = item.to && (location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to)))

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to || '#'}
                                title={isCollapsed ? item.label : undefined}
                                className={cn(
                                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 outline-none',
                                    isActive 
                                        ? 'bg-primary text-primary-foreground shadow-sm' 
                                        : 'hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                )}
                            >
                                <div className={cn(
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                                    isActive ? 'bg-white/20' : 'bg-muted/40 text-sidebar-foreground/70 group-hover:bg-muted/60'
                                )}>
                                    <Icon size={18} stroke={isActive ? 2.5 : 2} />
                                </div>
                                {!isCollapsed && (
                                    <div className='flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300'>
                                        <span className='truncate text-sm font-bold tracking-tight'>{item.label}</span>
                                        <span className={cn(
                                            'truncate text-[10px] leading-tight font-medium',
                                            isActive ? 'text-white' : 'text-sidebar-foreground/70'
                                        )}>
                                            {item.description}
                                        </span>
                                    </div>
                                )}
                            </NavLink>
                        )
                    })}
                </nav>
            </div>

            <div className='mt-auto border-t border-sidebar-border/60 bg-sidebar-accent/20 p-4 shrink-0'>
                <div className={cn(
                    'flex items-center gap-3 rounded-2xl bg-white/50 p-2 border border-white/80 transition-all duration-300',
                    isCollapsed ? 'justify-center p-1' : 'justify-between'
                )}>
                    <div className='flex items-center gap-2 overflow-hidden'>
                        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground font-bold shadow-sm'>
                            {session.name.slice(0, 1).toUpperCase()}
                        </div>
                        {!isCollapsed && (
                            <div className='flex flex-col truncate animate-in fade-in duration-300'>
                                <span className='truncate text-xs font-bold leading-tight'>{session.name}</span>
                                <span className='truncate text-[10px] text-muted-foreground'>{session.email}</span>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <Button 
                            variant='ghost' 
                            size='icon' 
                            onClick={handleLogout}
                            className='h-8 w-8 hover:bg-destructive/10 hover:text-destructive shrink-0'
                        >
                            <IconLogout size={16} />
                        </Button>
                    )}
                </div>
                {isCollapsed && (
                    <Button 
                        variant='ghost' 
                        size='icon' 
                        onClick={handleLogout}
                        className='mt-3 w-full hover:bg-destructive/10 hover:text-destructive'
                    >
                        <IconLogout size={18} />
                    </Button>
                )}
            </div>
        </aside>
    )
}
