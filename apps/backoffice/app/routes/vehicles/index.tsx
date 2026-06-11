import { useDeferredValue, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit, IconEye } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { useVehicles, type VehiclesListParams, type VehicleItem } from '~/queries/vehicles'
import { useStations } from '~/queries/stations'
import { useListingState } from '~/hooks'

export default function VehiclesListRoute() {
    const navigate = useNavigate()
    const { page, setPage, searchQuery, setSearchQuery, filters, setFilters, resetFilters } = useListingState({
        initialFilters: { station: 'all' }
    })
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const { data: stationsData } = useStations({ limit: 1000 })
    const stationOptions = useMemo(() => {
        if (!stationsData?.data) return []
        return stationsData.data.map(s => ({ label: s.name, value: s.id }))
    }, [stationsData])

    const queryParams = useMemo(() => {
        const params: VehiclesListParams = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }

        if (filters.station && filters.station !== 'all') {
            params['filter.stationId'] = [`$eq:${filters.station}`]
        }

        if (deferredSearchQuery) {
            params['filter.vehicleNumber'] = [`$ilike:${deferredSearchQuery}`]
        }

        return params
    }, [deferredSearchQuery, page, filters])

    const { data, isLoading } = useVehicles(queryParams)

    const vehicles = data?.data ?? []
    const paginationMeta = data?.meta

    const columns = useMemo(() => [
        { header: 'Reg Number', accessor: 'vehicleNumber' as const },
        {
            header: 'Brand/Model',
            cell: (vehicle: VehicleItem) => [vehicle.properties?.brand, vehicle.properties?.model].filter(Boolean).join(' ') || '—',
        },
        { header: 'GPS ID', accessor: 'gpsId' as const },
        { header: 'Station', cell: (vehicle: VehicleItem) => vehicle.station?.name ?? '—' },
        {
            header: 'Insurance Expiry',
            cell: (vehicle: VehicleItem) => (
                <span className="text-xs text-muted-foreground">{vehicle.properties?.insuranceExpiry ?? '—'}</span>
            ),
        },
        {
            header: 'Status',
            cell: (vehicle: VehicleItem) => <StatusBadge status={vehicle.status?.toUpperCase() ?? 'UNKNOWN'} />,
        },
        {
            header: 'Actions',
            cell: (vehicle: VehicleItem) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
                        <IconEye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}>
                        <IconEdit className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], [navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Vehicles...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Vehicle Inventory"
                    description="Register and track all fleet vehicles details."
                />
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate('/vehicles/assign')}>
                        Assign Vehicles
                    </Button>
                    <Button onClick={() => navigate('/vehicles/create')}>
                        <IconPlus className="mr-2 h-4 w-4" />
                        Register New Vehicle
                    </Button>
                </div>
            </div>

            <ResourceTable
                data={vehicles}
                emptyMessage="No vehicles found."
                searchPlaceholder="Search vehicles by registration number..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filterValues={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
                filterConfigs={[
                    {
                        field: 'stationId',
                        label: 'Station',
                        options: stationOptions
                    }
                ] as any}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? vehicles.length}
                onPageChange={setPage}
                columns={columns}
            />
        </div>
    )
}
