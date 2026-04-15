import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { mockApi } from '~/services/mockApi'
import { type User, type Vehicle, type VehicleSurrender } from '~/types/admin'
import { toast } from 'sonner'
import { formatCurrency, formatDate } from '~/lib/admin'

export default function SurrendersListRoute() {
    const navigate = useNavigate()
    const [surrenders, setSurrenders] = useState<VehicleSurrender[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [users, setUsers] = useState<User[]>([])

    const loadData = useCallback(async () => {
        try {
            const [nextSurrenders, nextVehicles, nextUsers] = await Promise.all([
                mockApi.listSurrenders(),
                mockApi.listVehicles(),
                mockApi.listUsers(),
            ])
            setSurrenders(nextSurrenders)
            setVehicles(nextVehicles)
            setUsers(nextUsers)
        } catch (error) {
            toast.error('Failed to load surrender records')
        }
    }, [])

    useEffect(() => {
        void loadData()
    }, [loadData])

    const getVehicleName = (id: string) => vehicles.find((v) => v.id === id)?.registrationNumber || id
    const getCustomerName = (id: string) => users.find((c) => c.id === id)?.name || id

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Vehicle Surrenders"
                    description="Handle vehicle returns, condition reports, and deposit closures."
                />
                <Button onClick={() => navigate('/surrender/create')}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Process Return
                </Button>
            </div>

            <ResourceTable
                title="Surrender Records"
                data={surrenders}
                emptyMessage="No surrenders found."
                columns={[
                    { header: 'Vehicle', cell: (s) => getVehicleName(s.vehicleId) },
                    { header: 'Customer', cell: (s) => getCustomerName(s.customerId) },
                    { header: 'Penalty', cell: (s) => formatCurrency(s.penaltyCharges) },
                    { header: 'Returned Deposit', cell: (s) => formatCurrency(s.depositReturnAmount) },
                    { header: 'Date', cell: (s) => formatDate(s.submittedAt) },
                    { header: 'Status', cell: (s) => <StatusBadge status={s.status} /> }
                ]}
            />
        </div>
    )
}
