import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { mockApi } from '~/services/mockApi'
import { type Vehicle } from '~/types/admin'
import { toast } from 'sonner'
import { formatDate } from '~/lib/formatter'

export default function VehiclesListRoute() {
    const navigate = useNavigate()
    const [vehicles, setVehicles] = useState<Vehicle[]>([])

    const loadVehicles = useCallback(async () => {
        try {
            const data = await mockApi.listVehicles()
            setVehicles(data)
        } catch (error) {
            toast.error('Failed to load vehicles')
        }
    }, [])

    useEffect(() => {
        void loadVehicles()
    }, [loadVehicles])

    return (
        <div className="space-y-8">
            <PageHeader
                title="Vehicle Inventory"
                description="Register and track all fleet vehicles details."
                actions={
                    <Button onClick={() => navigate('/vehicles/create')}>
                        <IconPlus className="mr-2 h-4 w-4" />
                        Register New Vehicle
                    </Button>
                }
            />

            <ResourceTable
                data={vehicles}
                searchFields={['registrationNumber', 'brand', 'model']}
                searchPlaceholder="Search vehicles by reg number, brand or model..."
                filterConfigs={[
                    {
                        field: 'status',
                        label: 'Status',
                        options: [
                            { label: 'Available', value: 'AVAILABLE' },
                            { label: 'In Use', value: 'IN_USE' },
                            { label: 'Maintenance', value: 'MAINTENANCE' },
                            { label: 'Charging', value: 'CHARGING' },
                        ]
                    }
                ]}
                emptyMessage="No vehicles found."
                columns={[
                    { header: 'Reg Number', accessor: 'registrationNumber' },
                    { header: 'Brand/Model', cell: (vehicle) => `${vehicle.brand} ${vehicle.model}` },
                    { header: 'GPS ID', accessor: 'gpsId' },
                    { header: 'Insurance Expiry', cell: (vehicle) => <span className="text-xs text-muted-foreground">{formatDate(vehicle.insuranceExpiry)}</span> },
                    { header: 'Status', cell: (vehicle) => <StatusBadge status={vehicle.status} /> },
                    {
                        header: 'Actions',
                        cell: (vehicle) => (
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}>
                                <IconEdit className="h-4 w-4" />
                            </Button>
                        ),
                    },
                ]}
            />
        </div>
    )
}
