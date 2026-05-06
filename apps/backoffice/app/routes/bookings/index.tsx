import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconEye, IconUser } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { useBookings, type BookingItem, type BookingsListParams } from '~/queries/bookings'
import { formatDate, formatCurrency } from '~/lib/formatter'

export default function BookingsListRoute() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState('all')

    const queryParams = useMemo(() => {
        const params: BookingsListParams = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }

        if (statusFilter !== 'all') {
            params['filter.status'] = [`$eq:${statusFilter}`]
        }

        return params
    }, [page, statusFilter])
    

    const { data, isLoading } = useBookings(queryParams)

    const bookings = data?.data ?? []
    const paginationMeta = data?.meta

    const handleFilterChange = useCallback((filters: Record<string, string>) => {
        setStatusFilter(filters.status || 'all')
        setPage(1)
    }, [])

    const columns = useMemo(() => [
        {
            header: 'Booking ID',
            cell: (booking: BookingItem) => (
                <span className="font-mono text-xs">{booking.id}</span>
            ),
        },
        {
            header: 'Customer Name',
            cell: (booking: BookingItem) => {
                const u = (booking.userPlan as any).user
                const name = [u?.firstName, u?.lastName].filter(Boolean).join(' ')
                return (
                    <div className='flex items-center gap-2'>
                        <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                            <IconUser size={13} />
                        </div>
                        <div>
                            <p className='text-sm font-medium text-foreground'>{name || u?.mobilenumber || u?.email || '—'}</p>
                            {name && (
                                <p className='text-xs text-muted-foreground'>{u?.mobilenumber ?? u?.email ?? '—'}</p>
                            )}
                        </div>
                    </div>
                )
            },
        },
        {
            header: 'Date of Purchase',
            cell: (booking: BookingItem) => (
                <span className="text-xs text-muted-foreground">{formatDate(booking.userPlan.createdAt)}</span>
            ),
        },
        {
            header: 'Plan Name',
            cell: (booking: BookingItem) => (
                <span>{(booking.userPlan as any).plan?.name ?? '—'}</span>
            ),
        },
        {
            header: 'Status',
            cell: (booking: BookingItem) => <StatusBadge status={booking.status.toUpperCase()} />,
        },
        {
            header: 'Plan Amount',
            cell: (booking: BookingItem) => (
                <span>{formatCurrency((booking.userPlan as any).plan?.totalAmount)}</span>
            ),
        },
        {
            header: 'Vehicle Number',
            cell: (booking: BookingItem) => (
                <span>{(booking as any).vehicle?.vehicleNumber ?? '—'}</span>
            ),
        },
        {
            header: 'Actions',
            cell: (booking: BookingItem) => (
                <Button variant="ghost" size="icon" onClick={() => navigate(`/bookings/${booking.id}`)}>
                    <IconEye className="h-4 w-4" />
                </Button>
            ),
        },
    ], [navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Bookings...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Bookings"
                    description="View and manage all customer bookings."
                />
            </div>

            <ResourceTable
                data={bookings}
                emptyMessage="No bookings found."
                filterValues={{ status: statusFilter }}
                onFilterChange={handleFilterChange}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? bookings.length}
                onPageChange={setPage}
                filterConfigs={[
                    {
                        field: 'status',
                        label: 'Status',
                        options: [
                            { label: 'Draft', value: 'draft' },
                            { label: 'Created', value: 'created' },
                            { label: 'Ongoing', value: 'ongoing' },
                            { label: 'Completed', value: 'completed' },
                            { label: 'Cancelled', value: 'cancelled' },
                            { label: 'Inactive', value: 'inactive' },
                        ],
                    },
                ]}
                columns={columns}
            />
        </div>
    )
}
