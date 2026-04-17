import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { Button } from '~/components/ui/button'
import { useBatteries, type BatteriesListParams } from '~/queries/batteries'

export default function BatteriesListRoute() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: BatteriesListParams = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }

        if (deferredSearchQuery) {
            params['filter.batteryId'] = [`$ilike:${deferredSearchQuery}`]
        }

        return params
    }, [deferredSearchQuery, page])

    const { data, isLoading } = useBatteries(queryParams)

    const batteries = useMemo(() => (data?.data ?? []).map((battery) => ({
        ...battery,
        capacity: battery.properties?.capacity ?? '—',
        range: battery.properties?.range ?? '—',
        stationName: battery.station?.name ?? 'Unassigned',
        removable: battery.properties?.removableOption ? 'Yes' : 'No',
    })), [data?.data])

    const paginationMeta = data?.meta

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const columns = useMemo(() => [
        { header: 'Code', accessor: 'batteryId' as const },
        { header: 'GPS ID', accessor: 'gpsId' as const },
        { header: 'Capacity', accessor: 'capacity' as const },
        { header: 'Range', accessor: 'range' as const },
        { header: 'Station', accessor: 'stationName' as const },
        { header: 'Removable', accessor: 'removable' as const },
        {
            header: 'Actions',
            cell: (b: (typeof batteries)[number]) => (
                <Button variant="ghost" size="icon" onClick={() => navigate(`/batteries/edit/${b.id}`)}>
                    <IconEdit className="h-4 w-4" />
                </Button>
            ),
        },
    ], [navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Batteries...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Battery Operations"
                    description="Manage battery lifecycle and station allocations across the network."
                />
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate('/batteries/assign')}>
                        Assign Batteries
                    </Button>
                    <Button onClick={() => navigate('/batteries/create')}>
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add Battery
                    </Button>
                </div>
            </div>

            <ResourceTable
                data={batteries}
                emptyMessage="No batteries in inventory."
                searchPlaceholder="Search by battery code..."
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? batteries.length}
                onPageChange={setPage}
                columns={columns}
            />
        </div>
    )
}
