import type { ReactNode } from 'react'

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-border/40 py-3 last:border-0">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="max-w-[62%] break-all text-right text-sm font-semibold text-foreground">
                {value ?? 'N/A'}
            </span>
        </div>
    )
}
