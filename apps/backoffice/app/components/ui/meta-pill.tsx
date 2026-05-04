import type { ComponentType, ReactNode } from 'react'

export function MetaPill({
    icon: Icon,
    children,
}: {
    icon: ComponentType<{ size?: number | string; className?: string }>
    children: ReactNode
}) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
            <Icon size={15} className="text-primary" />
            <span>{children}</span>
        </span>
    )
}
