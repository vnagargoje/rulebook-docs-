import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <h4 className={cn('mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground', className)}>
            {children}
        </h4>
    )
}
