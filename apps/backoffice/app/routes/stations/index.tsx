import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { useStations, type StationsListParams } from '~/queries/stations'

export default function StationsListRoute() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [typeFilter, setTypeFilter] = useState('all')
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: StationsListParams = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }

        if (deferredSearchQuery) {
            params['filter.name'] = [`$ilike:${deferredSearchQuery}`]
        }

        if (typeFilter !== 'all') {
            params['filter.type'] = [`$eq:${typeFilter}`]
        }

        return params
    }, [deferredSearchQuery, page, typeFilter])

    const { data, isLoading } = useStations(queryParams)

    const stations = useMemo(() => (data?.data ?? []).map((station) => ({
        ...station,
        id: station.id,
        displayType: station.type.replace(/_/g, ' '),
        cityName: station.address?.city?.name ?? '—',
        managerName: station.manager
            ? [station.manager.firstName, station.manager.lastName].filter(Boolean).join(' ') || '—'
            : '—',
    })), [data?.data])

    const paginationMeta = data?.meta

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const handleFilterChange = useCallback((filters: Record<string, string>) => {
        setTypeFilter(filters.type || 'all')
        setPage(1)
    }, [])

    const columns = useMemo(() => [
        { header: 'Name', accessor: 'name' as const },
        { header: 'Type', accessor: 'displayType' as const },
        { header: 'City', accessor: 'cityName' as const },
        { header: 'Manager', accessor: 'managerName' as const },
        {
            header: 'Status',
            cell: (station: (typeof stations)[number]) => <StatusBadge status={station.active ? 'ACTIVE' : 'INACTIVE'} />,
        },
        {
            header: 'Actions',
            cell: (station: (typeof stations)[number]) => (
                <Button variant="ghost" size="icon" onClick={() => navigate(`/stations/edit/${station.id}`)}>
                    <IconEdit className="h-4 w-4" />
                </Button>
            ),
        },
    ], [navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Stations...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Station Management"
                    description="Manage physical stations for swapping, charging, and vehicle hubs."
                />
                <Button onClick={() => navigate('/stations/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create New Station
                </Button>
            </div>

            <ResourceTable
                data={stations}
                emptyMessage="No stations found."
                searchPlaceholder="Search stations by name..."
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                filterValues={{ type: typeFilter }}
                onFilterChange={handleFilterChange}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? stations.length}
                onPageChange={setPage}
                filterConfigs={[
                    {
                        field: 'type',
                        label: 'Type',
                        options: [
                            { label: 'Swap Station', value: 'swap_station' },
                            { label: 'Hub Station', value: 'hub_station' },
                        ],
                    },
                ]}
                columns={columns}
            />
        </div>
    )
}
