import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable, type ResourceTableColumn } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { formatDate } from '~/lib/formatter'
import { useBatteryTransports, type BatteryTransportItem } from '~/queries/battery-transports'
import { useStations } from '~/queries/stations'
import { useListingState } from '~/hooks'

const TRANSPORT_STATUS_OPTIONS = [
    { label: 'In Transit', value: 'in_transit' },
    { label: 'Delivered', value: 'delivered' },
]

export default function BatteryTransportsRoute() {
    const navigate = useNavigate()
    const { page, setPage, filters, setFilters, resetFilters } = useListingState({ initialFilters: { status: 'all', station: 'all' } })

    const { data: stationsData } = useStations({ limit: 1000 })
    const stationOptions = useMemo(() => {
        if (!stationsData?.data) return []
        return stationsData.data.map(s => ({ label: s.name, value: s.id }))
    }, [stationsData])

    const queryParams = useMemo(() => {
        const params: Parameters<typeof useBatteryTransports>[0] = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }
        if (filters.status && filters.status !== 'all') {
            params['filter.status'] = [`$eq:${filters.status}`]
        }
        if (filters.station && filters.station !== 'all') {
            // Can be either fromStation or toStation, but typically we just map it to one if backend doesn't support OR. 
            // We'll map to fromStation.id as a reasonable default for "Station" filter in transport
            params['filter.fromStationId'] = [`$eq:${filters.station}`]
        }
        return params
    }, [page, filters])

    const { data } = useBatteryTransports(queryParams)
    const records = data?.data ?? []
    const paginationMeta = data?.meta

    const columns = useMemo<ResourceTableColumn<BatteryTransportItem>[]>(() => [
        {
            header: 'From Station',
            cell: (item) => (
                <div>
                    <p className='text-sm font-medium'>{item.fromStation?.name ?? 'N/A'}</p>
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
                    <p className='text-sm font-medium'>{item.toStation?.name ?? 'N/A'}</p>
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
                    {item.vehicle?.vehicleNumber ?? 'N/A'}
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
            ) : <span className='text-xs text-muted-foreground'>N/A</span>,
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
                filterValues={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
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
                    {
                        field: 'station',
                        label: 'Station',
                        options: stationOptions
                    }
                ] as any}
            />
        </div>
    )
}
