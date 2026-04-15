import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { IconMapPin, IconUsers, IconClipboardList, IconChevronRight } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { mockApi } from '~/services/mockApi'
import { 
    type VehicleStationAssignment, 
    type CustomerVehicleAssignment,
    type CustomerRequest,
    type Vehicle,
    type Station,
    type User
} from '~/types/admin'
import { toast } from 'sonner'
import { formatDate } from '~/lib/formatter'

export default function AssignmentsListRoute() {
    const navigate = useNavigate()
    const [stationAssignments, setStationAssignments] = useState<VehicleStationAssignment[]>([])
    const [customerAssignments, setCustomerAssignments] = useState<CustomerVehicleAssignment[]>([])
    const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [stations, setStations] = useState<Station[]>([])
    const [customers, setCustomers] = useState<User[]>([])

    const loadData = useCallback(async () => {
        try {
            const [nextSA, nextCA, nextCR, nextV, nextS, nextC] = await Promise.all([
                mockApi.listVehicleStationAssignments(),
                mockApi.listCustomerVehicleAssignments(),
                mockApi.listCustomerRequests(),
                mockApi.listVehicles(),
                mockApi.listStations(),
                mockApi.listUsers(),
            ])
            setStationAssignments(nextSA)
            setCustomerAssignments(nextCA)
            setCustomerRequests(nextCR)
            setVehicles(nextV)
            setStations(nextS)
            setCustomers(nextC.filter((u) => u.role === 'CUSTOMER'))
        } catch (error) {
            toast.error('Failed to load assignment data')
        }
    }, [])

    useEffect(() => {
        void loadData()
    }, [loadData])

    const getVehicleName = (id: string) => vehicles.find((v) => v.id === id)?.registrationNumber || id
    const getStationName = (id: string) => stations.find((s) => s.id === id)?.name || id
    const getCustomerName = (id: string) => customers.find((c) => c.id === id)?.name || id

    return (
        <div className="space-y-8">
            <PageHeader
                title="Fleet Allocations"
                description="Optimize network coverage by allocating vehicles to operational hubs or directly to customers."
                actions={
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => navigate('/assignments/create-station')}>
                            Assign to Station
                        </Button>
                        <Button onClick={() => navigate('/assignments/create-customer')}>
                            Assign to Customer
                        </Button>
                    </div>
                }
            />

            <Tabs defaultValue="stations" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="stations" className="gap-2">
                        <IconMapPin size={18} />
                        Station Assignments
                    </TabsTrigger>
                    <TabsTrigger value="customers" className="gap-2">
                        <IconUsers size={18} />
                        Customer Assignments
                    </TabsTrigger>
                    <TabsTrigger value="requests" className="gap-2">
                        <IconClipboardList size={18} />
                        New Requests
                        {customerRequests.filter(r => r.status === 'PENDING').length > 0 && (
                            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                                {customerRequests.filter(r => r.status === 'PENDING').length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="stations" className="space-y-4">
                    <ResourceTable
                        data={stationAssignments}
                        searchFields={['vehicleId', 'stationId']}
                        searchPlaceholder="Search by vehicle or hub ID..."
                        emptyMessage="No station assignments found."
                        columns={[
                            { header: 'Vehicle ID', cell: (a) => <span className="font-mono font-bold text-slate-700">{getVehicleName(a.vehicleId)}</span> },
                            { header: 'Operational Hub', cell: (a) => <span className="font-medium">{getStationName(a.stationId)}</span> },
                            { header: 'Assigned Date', cell: (a) => <span className="text-xs text-muted-foreground">{formatDate(a.assignedAt)}</span> },
                            { header: 'Status', cell: (a) => <StatusBadge status={a.status} /> },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="customers" className="space-y-4">
                    <ResourceTable
                        data={customerAssignments}
                        searchFields={['vehicleId', 'customerId']}
                        searchPlaceholder="Search by vehicle or customer..."
                        emptyMessage="No customer assignments found."
                        columns={[
                            { header: 'Vehicle ID', cell: (a) => <span className="font-mono font-bold text-slate-700">{getVehicleName(a.vehicleId)}</span> },
                            { 
                                header: 'Customer', 
                                cell: (a) => (
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-[10px] font-bold uppercase">
                                            {getCustomerName(a.customerId).slice(0, 2)}
                                        </div>
                                        <span className="font-medium">{getCustomerName(a.customerId)}</span>
                                    </div>
                                ) 
                            },
                            { header: 'Assigned Date', cell: (a) => <span className="text-xs text-muted-foreground">{formatDate(a.assignedAt)}</span> },
                            { header: 'Status', cell: (a) => <StatusBadge status={a.status} /> },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                    <ResourceTable
                        data={customerRequests}
                        searchFields={['customerId', 'preferredStationId']}
                        searchPlaceholder="Search by applicant or hub..."
                        emptyMessage="No new customer requests."
                        columns={[
                            { 
                                header: 'Applicant', 
                                cell: (r) => (
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{getCustomerName(r.customerId)}</span>
                                    </div>
                                ) 
                            },
                            { header: 'Preferred Logistics Hub', cell: (r) => <span className="text-slate-600 font-medium">{getStationName(r.preferredStationId)}</span> },
                            { header: 'Request Time', cell: (r) => <span className="text-xs text-muted-foreground">{formatDate(r.requestedAt)}</span> },
                            { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
                            {
                                header: 'Resolution',
                                cell: (r) => (
                                    r.status === 'PENDING' && (
                                        <Button variant="outline" size="sm" className="h-8 gap-1 group" onClick={() => navigate(`/assignments/create-customer/${r.customerId}`)}>
                                            Fulfill <IconChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    )
                                ),
                            },
                        ]}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
