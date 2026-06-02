import { useDeferredValue, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconEdit, IconEye, IconPlus } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { formatLabel } from '~/lib/formatter'
import { useStations, type StationItem, type StationsListParams } from '~/queries/stations'
import { getStationCreatePath, getStationEditPath, getStationViewPath } from '~/constants'
import { useListingState } from '~/hooks'

export default function HubStationsListRoute() {
    const navigate = useNavigate()
    const { page, setPage, searchQuery, setSearchQuery } = useListingState()
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: StationsListParams = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
            'filter.type': ['$eq:hub_station'],
        }

        if (deferredSearchQuery) {
            params['filter.name'] = [`$ilike:${deferredSearchQuery}`]
        }

        return params
    }, [deferredSearchQuery, page])

    const { data, isLoading } = useStations(queryParams)
    const stations = data?.data ?? []
    const paginationMeta = data?.meta

    const columns = useMemo(() => [
        { header: 'Name', accessor: 'name' as const },
        { header: 'Type', cell: (station: StationItem) => formatLabel(station.type) },
        { header: 'City', cell: (station: StationItem) => station.address?.city?.name ?? '—' },
        {
            header: 'Status',
            cell: (station: StationItem) => <StatusBadge status={station.active ? 'ACTIVE' : 'INACTIVE'} />,
        },
        {
            header: 'Actions',
            cell: (station: StationItem) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate(getStationViewPath('hub_station', station.id))}>
                        <IconEye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(getStationEditPath('hub_station', station.id))}>
                        <IconEdit className="h-4 w-4" />
                    </Button>
                </div>
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
                    title="Hub Stations"
                    description="Manage operational hubs and supporting station infrastructure."
                />
                <Button onClick={() => navigate(getStationCreatePath('hub_station'))}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create New Station
                </Button>
            </div>

            <ResourceTable
                data={stations}
                emptyMessage="No hub stations found."
                searchPlaceholder="Search hub stations by name..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? stations.length}
                onPageChange={setPage}
                columns={columns}
            />
        </div>
    )
}
