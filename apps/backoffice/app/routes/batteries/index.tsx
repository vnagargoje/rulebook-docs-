import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit, IconEye, IconMapPin } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { Button } from '~/components/ui/button'
import { StatusBadge } from '~/components/ui/status-badge'
import { useBatteries, type BatteriesListParams, type BatteryItem } from '~/queries/batteries'

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
            params['filter.batteryQrId'] = [`$ilike:${deferredSearchQuery}`]
        }

        return params
    }, [deferredSearchQuery, page])

    const { data, isLoading } = useBatteries(queryParams)

    const batteries = data?.data ?? []
    const paginationMeta = data?.meta

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const columns = useMemo(
        () => [
            { header: 'Code', accessor: 'batteryQrId' as const },
            { header: 'GPS ID', accessor: 'gpsId' as const },
            { header: 'Capacity', cell: (b: BatteryItem) => b.properties?.capacity ?? '—' },
            { header: 'Range', cell: (b: BatteryItem) => b.properties?.range ?? '—' },
            { header: 'Station', cell: (b: BatteryItem) => b.station?.name ?? 'Unassigned' },
            { header: 'Status', cell: (b: BatteryItem) => <StatusBadge status={(b.status ?? '').toUpperCase()} /> },
            {
                header: 'SOC',
                cell: (b: BatteryItem) => {
                    const soc = (b.properties as Record<string, unknown> | null)?.socPercent as number | undefined
                    return soc != null ? `${soc}%` : '—'
                },
            },
            { header: 'Removable', cell: (b: BatteryItem) => (b.properties?.removableOption ? 'Yes' : 'No') },
            {
                header: 'Actions',
                cell: (b: BatteryItem) => (
                    <div className='flex items-center gap-1'>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => navigate(`/batteries/${b.id}`)}>
                            <IconEye className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => navigate(`/batteries/edit/${b.id}`)}>
                            <IconEdit className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            title='Track Battery'
                            onClick={() => navigate(`/batteries/track/${b.id}`)}>
                            <IconMapPin className='h-4 w-4' />
                        </Button>
                    </div>
                ),
            },
        ],
        [navigate],
    )

    if (isLoading) {
        return (
            <div className='p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase'>
                Loading Batteries...
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <PageHeader
                    title='Battery Operations'
                    description='Manage battery lifecycle and station allocations across the network.'
                />
                <div className='flex items-center gap-3'>
                    <Button
                        variant='outline'
                        onClick={() => navigate('/batteries/assign')}>
                        Assign Batteries
                    </Button>
                    <Button onClick={() => navigate('/batteries/create')}>
                        <IconPlus className='mr-2 h-4 w-4' />
                        Add Battery
                    </Button>
                </div>
            </div>

            <ResourceTable
                data={batteries}
                emptyMessage='No batteries in inventory.'
                searchPlaceholder='Search by battery code...'
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
