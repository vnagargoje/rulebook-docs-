import type { ComponentType, ReactNode } from 'react'

export function StatTile({
    label,
    value,
    icon: Icon,
}: {
    label: string
    value: ReactNode
    icon: ComponentType<{ size?: number | string; className?: string }>
}) {
    return (
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={18} />
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
            <div className="mt-1 text-lg font-semibold text-foreground">{value ?? '—'}</div>
        </div>
    )
}
