import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { mockApi } from '~/services/mockApi'
import { type InactiveVehicleRecord, type Vehicle } from '~/types/admin'
import { toast } from 'sonner'
import { formatDate } from '~/lib/admin'

export default function InactiveVehiclesListRoute() {
    const navigate = useNavigate()
    const [records, setRecords] = useState<InactiveVehicleRecord[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])

    const loadData = useCallback(async () => {
        try {
            const [data, fleet] = await Promise.all([
                mockApi.listInactiveVehicles(),
                mockApi.listVehicles()
            ])
            setRecords(data)
            setVehicles(fleet)
        } catch (error) {
            toast.error('Failed to load inactive records')
        }
    }, [])

    useEffect(() => {
        void loadData()
    }, [loadData])

    const getVehicleName = (id: string) => vehicles.find((v) => v.id === id)?.registrationNumber || id

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Inactive Vehicles"
                    description="Monitor out-of-service vehicles and their review status."
                />
                <Button onClick={() => navigate('/inactive-vehicles/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Report Inactive Vehicle
                </Button>
            </div>

            <ResourceTable
                title="Inactive Queue"
                data={records}
                emptyMessage="No inactive vehicles found."
                columns={[
                    { header: 'Vehicle', cell: (record) => getVehicleName(record.vehicleId) },
                    { header: 'Reported', cell: (record) => formatDate(record.reportedDate) },
                    { header: 'Status', cell: (record) => <StatusBadge status={record.status} /> },
                    {
                        header: 'Actions',
                        cell: (record) => (
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/inactive-vehicles/edit/${record.id}`)}>
                                <IconEdit className="h-4 w-4" />
                            </Button>
                        ),
                    },
                ]}
            />
        </div>
    )
}
