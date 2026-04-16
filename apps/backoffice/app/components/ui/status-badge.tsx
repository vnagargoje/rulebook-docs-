import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

const statusStyles: Record<string, string> = {
    ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    AVAILABLE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    ASSIGNED: 'border-sky-200 bg-sky-50 text-sky-700',
    ASSIGNED_TO_STATION: 'border-sky-200 bg-sky-50 text-sky-700',
    ASSIGNED_TO_CUSTOMER: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    IN_PROGRESS: 'border-amber-200 bg-amber-50 text-amber-700',
    REPORTED: 'border-orange-200 bg-orange-50 text-orange-700',
    UNDER_REVIEW: 'border-orange-200 bg-orange-50 text-orange-700',
    IN_MAINTENANCE: 'border-amber-200 bg-amber-50 text-amber-700',
    INACTIVE: 'border-slate-200 bg-slate-100 text-slate-700',
    INACTIVE_VEHICLE: 'border-slate-200 bg-slate-100 text-slate-700',
    NEEDS_CHARGE: 'border-amber-200 bg-amber-50 text-amber-700',
    IN_TRANSIT: 'border-violet-200 bg-violet-50 text-violet-700',
    SUBMITTED: 'border-orange-200 bg-orange-50 text-orange-700',
    APPROVED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    CLOSED: 'border-slate-200 bg-slate-100 text-slate-700',
    COMPLETED: 'border-slate-200 bg-slate-100 text-slate-700',
    RESOLVED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

export function StatusBadge({ status }: { status: string }) {
    return (
        <Badge
            variant='outline'
            className={cn('rounded-full border px-2.5 py-1 font-medium tracking-wide uppercase', statusStyles[status])}>
            {status.replaceAll('_', ' ')}
        </Badge>
    )
}
