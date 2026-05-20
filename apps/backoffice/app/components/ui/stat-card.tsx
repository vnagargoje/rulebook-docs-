import type { ReactNode } from 'react'
import { Card, CardContent } from '~/components/ui/card'
import { cn } from '~/lib/utils'

export function StatCard({
    title,
    value,
    helper,
    icon,
    trend,
    className,
    onClick,
}: {
    title: string
    value: string | number
    helper: string
    icon: ReactNode
    trend?: { value: string; positive: boolean }
    className?: string
    onClick?: () => void
}) {
    return (
        <Card
            className={cn(
                'relative overflow-hidden border-border/40 bg-white/80 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1',
                onClick && 'cursor-pointer',
                className,
            )}
            onClick={onClick}
        >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-primary pointer-events-none">
                {icon}
            </div>
            <CardContent className='p-5'>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70'>
                            {title}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className='font-display text-3xl font-bold tracking-tight text-foreground'>
                                {value}
                            </h3>
                            {trend && (
                                <span className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                    trend.positive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                                )}>
                                    {trend.value}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/5'>
                        <div className="scale-90">{icon}</div>
                    </div>
                </div>
                <div className="mt-4 flex items-start gap-2">
                    <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary animate-pulse" />
                    <p className='text-[10px] font-medium text-muted-foreground leading-snug'>
                        {helper}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
