import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconEye } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { useBookings, type BookingItem, type BookingsListParams } from '~/queries/bookings'
import { formatDate } from '~/lib/formatter'

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
        { header: 'Booking ID', accessor: 'id' as const },
        {
            header: 'Station',
            cell: (booking: BookingItem) => (
                <span>{(booking as any).station?.name ?? booking.stationId ?? '—'}</span>
            ),
        },
        { header: 'Status', cell: (booking: BookingItem) => <StatusBadge status={booking.status.toUpperCase()} /> },
        {
            header: 'Vehicle',
            cell: (booking: BookingItem) => (
                <span>{(booking as any).vehicle?.vehicleNumber ?? booking.vehicleId ?? '—'}</span>
            ),
        },
        {
            header: 'Created',
            cell: (booking: BookingItem) => <span className="text-xs text-muted-foreground">{formatDate(booking.createdAt)}</span>,
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
