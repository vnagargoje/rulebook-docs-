import { useDeferredValue, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus } from '@tabler/icons-react'


import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { useStations, type StationItem, type StationsListParams } from '~/queries/stations'
import { getStationCreatePath, getStationViewPath } from '~/constants'

import { useListingState } from '~/hooks'

export default function VehicleStationsListRoute() {
    const navigate = useNavigate()
    const { page, setPage, searchQuery, setSearchQuery, filters, setFilters, resetFilters } = useListingState({
        initialFilters: { status: 'all' }
    })
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: StationsListParams = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
            'filter.type': ['$eq:vehicle_station'],
        }

        if (filters.status && filters.status !== 'all') {
            params['filter.active'] = [`$eq:${filters.status}`]
        }

        if (deferredSearchQuery) {
            params['filter.name'] = [`$ilike:${deferredSearchQuery}`]
        }

        return params
    }, [deferredSearchQuery, page, filters])

    const { data, isLoading } = useStations(queryParams)
    const stations = data?.data ?? []
    const paginationMeta = data?.meta

    const columns = useMemo(() => [
        { header: 'Name', accessor: 'name' as const },
        { header: 'City', cell: (station: StationItem) => station.address?.city?.name ?? 'N/A' },
        {
            header: 'Status',
            cell: (station: StationItem) => <StatusBadge status={station.active ? 'ACTIVE' : 'INACTIVE'} />,
        },
    ], [navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Stations...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Vehicle Stations"
                    description="Manage vehicle parking and assignment stations."
                />
                <Button onClick={() => navigate(getStationCreatePath('vehicle_station'))}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create New Station
                </Button>
            </div>

            <ResourceTable
                data={stations}
                onRowClick={(item) => navigate(getStationViewPath('vehicle_station', item.id))}
                emptyMessage="No vehicle stations found."
                searchPlaceholder="Search vehicle stations by name..."
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
                            { label: 'Active', value: 'true' },
                            { label: 'Inactive', value: 'false' },
                        ]
                    }
                ] as any}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? stations.length}
                onPageChange={setPage}
                columns={columns}
            />
        </div>
    )
}
