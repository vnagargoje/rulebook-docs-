import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus } from '@tabler/icons-react'


import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { mockApi } from '~/services/mockApi'
import { type MaintenanceRecord, type Vehicle } from '~/types/admin'
import { toast } from 'sonner'
import { formatDate } from '~/lib/formatter'

export default function MaintenanceListRoute() {
    const navigate = useNavigate()
    const [records, setRecords] = useState<MaintenanceRecord[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])

    const loadData = useCallback(async () => {
        try {
            const [data, fleet] = await Promise.all([
                mockApi.listMaintenance(),
                mockApi.listVehicles()
            ])
            setRecords(data)
            setVehicles(fleet)
        } catch (error) {
            toast.error('Failed to load maintenance records')
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
                    title="Vehicle Maintenance"
                    description="Manage repairs and service schedules for your fleet."
                />
                <Button onClick={() => navigate('/maintenance/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Log Maintenance
                </Button>
            </div>

            <ResourceTable
                
                data={records}
                onRowClick={(item) => navigate(`/maintenance/edit/${item.id}`)}
                emptyMessage="No maintenance records found."
                columns={[
                    { header: 'Vehicle', cell: (record) => getVehicleName(record.vehicleId) },
                    { header: 'Reported', cell: (record) => formatDate(record.reportedDate) },
                    { header: 'Technician', accessor: 'technicianName' },
                    { header: 'Expected Fix', cell: (record) => formatDate(record.expectedFixDate) },
                    { header: 'Status', cell: (record) => <StatusBadge status={record.status} /> },
                ]}
            />
        </div>
    )
}
