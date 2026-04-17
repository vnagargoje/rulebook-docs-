import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { Button } from '~/components/ui/button'
import { useVehicles, type VehiclesListParams } from '~/queries/vehicles'
import { formatDate } from '~/lib/formatter'

export default function VehiclesListRoute() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const deferredSearchQuery = useDeferredValue(searchQuery.trim())

    const queryParams = useMemo(() => {
        const params: VehiclesListParams = {
            page,
            limit: 10,
            sortBy: ['createdAt:DESC'],
        }

        if (deferredSearchQuery) {
            params['filter.vehicleNumber'] = [`$ilike:${deferredSearchQuery}`]
        }

        return params
    }, [deferredSearchQuery, page])

    const { data, isLoading } = useVehicles(queryParams)

    const vehicles = useMemo(() => (data?.data ?? []).map((vehicle) => ({
        ...vehicle,
        brandModel: [vehicle.properties?.brand, vehicle.properties?.model].filter(Boolean).join(' ') || '—',
        stationName: vehicle.station?.name ?? '—',
        insuranceExpiry: vehicle.properties?.insuranceExpiry
            ? formatDate(vehicle.properties.insuranceExpiry)
            : '—',
    })), [data?.data])

    const paginationMeta = data?.meta

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const columns = useMemo(() => [
        { header: 'Reg Number', accessor: 'vehicleNumber' as const },
        { header: 'Brand/Model', accessor: 'brandModel' as const },
        { header: 'GPS ID', accessor: 'gpsId' as const },
        { header: 'Station', accessor: 'stationName' as const },
        {
            header: 'Insurance Expiry',
            cell: (vehicle: (typeof vehicles)[number]) => (
                <span className="text-xs text-muted-foreground">{vehicle.insuranceExpiry}</span>
            ),
        },
        {
            header: 'Actions',
            cell: (vehicle: (typeof vehicles)[number]) => (
                <Button variant="ghost" size="icon" onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}>
                    <IconEdit className="h-4 w-4" />
                </Button>
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
                <Button onClick={() => navigate('/vehicles/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Register New Vehicle
                </Button>
            </div>

            <ResourceTable
                data={vehicles}
                emptyMessage="No vehicles found."
                searchPlaceholder="Search vehicles by registration number..."
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                currentPage={paginationMeta?.currentPage ?? page}
                totalPages={paginationMeta?.totalPages ?? 1}
                totalItems={paginationMeta?.totalItems ?? vehicles.length}
                onPageChange={setPage}
                columns={columns}
            />
        </div>
    )
}
