import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable, type ResourceTableColumn } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { formatDate } from '~/lib/formatter'
import { useBatteryTransports, type BatteryTransportItem } from '~/queries/battery-transports'

const TRANSPORT_STATUS_OPTIONS = [
    { label: 'In Transit', value: 'in_transit' },
    { label: 'Delivered', value: 'delivered' },
]

export default function BatteryTransportsRoute() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState('all')

    const queryParams = useMemo(() => {
        const params: Parameters<typeof useBatteryTransports>[0] = {
            page,
            limit: 20,
            sortBy: ['createdAt:DESC'],
        }
        if (statusFilter !== 'all') {
            params['filter.status'] = [`$eq:${statusFilter}`]
        }
        return params
    }, [page, statusFilter])

    const { data } = useBatteryTransports(queryParams)
    const records = data?.data ?? []
    const paginationMeta = data?.meta

    const handleFilterChange = useCallback((filters: Record<string, string>) => {
        setStatusFilter(filters.status ?? 'all')
        setPage(1)
    }, [])

    const columns = useMemo<ResourceTableColumn<BatteryTransportItem>[]>(() => [
        {
            header: 'From Station',
            cell: (item) => (
                <div>
                    <p className='text-sm font-medium'>{item.fromStation?.name ?? '—'}</p>
                    {item.fromStation?.type && (
                        <p className='text-xs text-muted-foreground capitalize'>{item.fromStation.type.replace('_', ' ')}</p>
                    )}
                </div>
            ),
        },
        {
            header: 'To Station',
            cell: (item) => (
                <div>
                    <p className='text-sm font-medium'>{item.toStation?.name ?? '—'}</p>
                    {item.toStation?.type && (
                        <p className='text-xs text-muted-foreground capitalize'>{item.toStation.type.replace('_', ' ')}</p>
                    )}
                </div>
            ),
        },
        {
            header: 'Status',
            cell: (item) => <StatusBadge status={item.status.toUpperCase()} />,
        },
        {
            header: 'Batteries',
            cell: (item) => (
                <span className='inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700'>
                    {item.batteryIds.length}
                </span>
            ),
        },
        {
            header: 'Vehicle',
            cell: (item) => (
                <span className='text-sm text-muted-foreground'>
                    {item.vehicle?.vehicleNumber ?? '—'}
                </span>
            ),
        },
        {
            header: 'Date',
            cell: (item) => item.createdAt ? (
                <div>
                    <p className='text-xs text-muted-foreground'>{formatDate(item.createdAt)}</p>
                    <p className='text-xs text-muted-foreground'>
                        {new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                </div>
            ) : <span className='text-xs text-muted-foreground'>—</span>,
        },
    ], [])

    return (
        <div className='space-y-6'>
            <PageHeader
                title='Battery Transports'
                description='All battery transport movements between stations.'
            />
            <ResourceTable
                data={records}
                columns={columns}
                emptyMessage='No transport records found.'
                onRowClick={(item) => navigate(`/battery-transports/${item.id}`)}
                filterValues={{ status: statusFilter }}
                onFilterChange={handleFilterChange}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? records.length}
                onPageChange={setPage}
                filterConfigs={[
                    {
                        field: 'status',
                        label: 'Status',
                        options: TRANSPORT_STATUS_OPTIONS,
                    },
                ]}
            />
        </div>
    )
}
