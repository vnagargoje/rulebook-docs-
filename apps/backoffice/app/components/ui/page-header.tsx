import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

interface PageHeaderProps {
    title: string
    description: string
    actions?: ReactNode
    className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
    return (
        <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
            <div className='space-y-2'>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground'>YUGO Admin</p>
                <div className='space-y-1'>
                    <h2 className='font-display text-3xl font-semibold tracking-tight'>{title}</h2>
                    <p className='max-w-3xl text-sm leading-6 text-muted-foreground'>{description}</p>
                </div>
            </div>
            {actions ? <div className='flex flex-wrap items-center gap-3'>{actions}</div> : null}
        </div>
    )
}
