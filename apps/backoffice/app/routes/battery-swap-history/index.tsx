import { useMemo } from 'react'
import { IconUser } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable, type ResourceTableColumn } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { formatDate } from '~/lib/formatter'
import { useSwapHistory, type SwapHistoryItem } from '~/queries/swap-history'
import { useStations } from '~/queries/stations'
import { useListingState } from '~/hooks'

export default function BatterySwapHistoryRoute() {
    const { page, setPage, filters, setFilters, searchQuery, setSearchQuery, resetFilters } = useListingState({
        initialFilters: { station: 'all', status: 'all' }
    })

    const { data: stationsData } = useStations({ limit: 1000 })
    const stationOptions = useMemo(() => {
        if (!stationsData?.data) return []
        return stationsData.data.map(s => ({ label: s.name, value: s.id }))
    }, [stationsData])

    const queryParams = useMemo(() => {
        const params: any = { page, limit: 10, sortBy: ['createdAt:DESC' as const] }
        if (filters.station && filters.station !== 'all') {
            params['filter.fromStation.id'] = [`$eq:${filters.station}`]
        }
        if (filters.status && filters.status !== 'all') {
            params['filter.status'] = [`$eq:${filters.status}`]
        }
        if (searchQuery.trim()) {
            params.search = searchQuery.trim()
        }
        return params
    }, [page, filters, searchQuery])

    const { data } = useSwapHistory(queryParams)
    const records = data?.data ?? []
    const paginationMeta = data?.meta

    const columns = useMemo<ResourceTableColumn<SwapHistoryItem>[]>(() => [
        {
            header: 'Customer',
            cell: (item) => {
                const user = item.userPlan?.user
                const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—'
                return (
                    <div className='flex items-center gap-2'>
                        <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                            <IconUser size={13} />
                        </div>
                        <div>
                            <p className='text-sm font-medium text-foreground'>{name}</p>
                            <p className='text-xs text-muted-foreground'>{user?.mobilenumber ?? '—'}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            header: 'Old Battery ID',
            cell: (item) => (
                <span className='rounded-md bg-red-50 px-2 py-0.5 text-xs font-mono font-medium text-red-700'>
                    {item.oldBattery?.batteryQrId ?? '—'}
                </span>
            ),
        },
        {
            header: 'New Battery ID',
            cell: (item) => (
                <span className='rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-mono font-medium text-emerald-700'>
                    {item.newBattery?.batteryQrId ?? '—'}
                </span>
            ),
        },
        {
            header: 'Station',
            cell: (item) => (
                <div>
                    <p className='text-sm font-medium'>{item.fromStation?.name ?? item.toStation?.name ?? '—'}</p>
                    {item.fromStation?.type && (
                        <p className='text-xs text-muted-foreground capitalize'>{item.fromStation.type.replace('_', ' ')}</p>
                    )}
                </div>
            ),
        },
        {
            header: 'Status',
            cell: () => <StatusBadge status='COMPLETED' />,
        },
        {
            header: 'Date',
            cell: (item) => (
                <div>
                    <p className='text-xs text-muted-foreground'>{formatDate(item.createdAt)}</p>
                    <p className='text-xs text-muted-foreground'>
                        {new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                </div>
            ),
        },
    ], [])

    return (
        <div className='space-y-6'>
            <PageHeader
                title='Battery Swap History'
                description='All battery swap transactions across stations.'
            />
            <ResourceTable
                data={records}
                columns={columns}
                emptyMessage='No swap history found.'
                searchPlaceholder='Search swaps...'
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filterValues={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
                filterConfigs={[
                    {
                        field: 'status',
                        label: 'Status',
                        options: [
                            { label: 'Completed', value: 'completed' },
                            { label: 'Failed', value: 'failed' }
                        ]
                    },
                    {
                        field: 'station',
                        label: 'Station',
                        options: stationOptions
                    }
                ] as any}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? records.length}
                onPageChange={setPage}
            />
        </div>
    )
}
