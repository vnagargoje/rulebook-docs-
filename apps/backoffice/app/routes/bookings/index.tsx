import { useMemo, useDeferredValue } from 'react'
import { useNavigate } from 'react-router'
import { IconUser } from '@tabler/icons-react'


import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { useBookings, type BookingItem, type BookingsListParams } from '~/queries/bookings'
import { useListingState, useBookingExport } from '~/hooks'
import { ExportDialog } from '~/components/ui/export-dialog'
import { useState } from 'react'
import { formatDate, formatCurrency } from '~/lib/formatter'

export default function BookingsListRoute() {
    const navigate = useNavigate()
    const { page, setPage, filters, setFilters, resetFilters, searchQuery, setSearchQuery } = useListingState({ initialFilters: { status: 'all' } })
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: BookingsListParams = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }

        if (filters.status && filters.status !== 'all') {
            params['filter.status'] = [`$eq:${filters.status}`]
        }

        if (deferredSearchQuery) {
            (params as any).search = deferredSearchQuery
        }

        return params
    }, [page, filters, deferredSearchQuery])
    

    const { data, isLoading } = useBookings(queryParams)

    const bookings = data?.data ?? []
    const paginationMeta = data?.meta

    const [exportModalOpen, setExportModalOpen] = useState(false)
    const { mutate, isPending } = useBookingExport()

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
                            <p className='text-sm font-medium text-foreground'>{name || u?.mobilenumber || u?.email || 'N/A'}</p>
                            {name && (
                                <p className='text-xs text-muted-foreground'>{u?.mobilenumber ?? u?.email ?? 'N/A'}</p>
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
            cell: (booking: BookingItem) => {
                const planSnapshot = (booking.userPlan as any).planSnapshot ?? {}
                const plan = (booking.userPlan as any).plan
                return <span>{planSnapshot.name ?? plan?.name ?? '—'}</span>
            },
        },
        {
            header: 'Status',
            cell: (booking: BookingItem) => <StatusBadge status={booking.status.toUpperCase()} />,
        },
        {
            header: 'Plan Amount',
            cell: (booking: BookingItem) => {
                const planSnapshot = (booking.userPlan as any).planSnapshot ?? {}
                const plan = (booking.userPlan as any).plan
                return <span>{formatCurrency(planSnapshot.totalAmount ?? plan?.totalAmount)}</span>
            },
        },
        {
            header: 'Vehicle Number',
            cell: (booking: BookingItem) => (
                <span>{(booking as any).vehicle?.vehicleNumber ?? 'N/A'}</span>
            ),
        },
    ], [navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Bookings...</div>
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Bookings"
                description="View and manage all customer bookings."
                actions={
                    <ExportDialog 
                        open={exportModalOpen} 
                        onOpenChange={setExportModalOpen}
                        title="Export Bookings"
                        description="Download booking records as an Excel spreadsheet."
                        showDateFilter={true}
                        showStatusFilter={true}
                        statusOptions={[
                            { label: 'Draft', value: 'draft' },
                            { label: 'Created', value: 'created' },
                            { label: 'Ongoing', value: 'ongoing' },
                            { label: 'Completed', value: 'completed' },
                            { label: 'Cancelled', value: 'cancelled' },
                            { label: 'Inactive', value: 'inactive' },
                        ]}
                        isExporting={isPending}
                        onExport={(filters) => mutate(filters, { onSuccess: () => setExportModalOpen(false) })}
                    />
                }
            />

            <ResourceTable
                data={bookings}
                onRowClick={(item) => navigate(`/bookings/${item.id}`)}
                emptyMessage="No bookings found."
                searchPlaceholder="Search bookings..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                totalItems={paginationMeta?.totalItems ?? bookings.length}
                totalPages={paginationMeta?.totalPages ?? 1}
                currentPage={paginationMeta?.currentPage ?? page}
                onPageChange={setPage}
                onReset={resetFilters}
                filterValues={filters}
                onFilterChange={setFilters}
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
                    }
                ] as any}
                columns={columns}
            />
        </div>
    )
}
