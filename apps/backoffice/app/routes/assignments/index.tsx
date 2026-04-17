import { useDeferredValue, useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconMapPin, IconUsers, IconClipboardList, IconChevronRight } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { mockApi } from '~/services/mockApi'
import { useStations } from '~/queries/stations'
import { useVehicles } from '~/queries/vehicles'
import { 
    type CustomerVehicleAssignment,
    type CustomerVehicleRequest,
    type Vehicle,
    type Station,
    type User
} from '~/types/admin'
import { toast } from 'sonner'
import { formatDate } from '~/lib/formatter'

type StationAssignmentRow = {
    id: string
    vehicleId: string
    vehicleNumber: string
    stationId: string
    stationName: string
    assignedAt: string
    status: 'ASSIGNED'
}

export default function AssignmentsListRoute() {
    const navigate = useNavigate()
    const [stationAssignmentsSearchQuery, setStationAssignmentsSearchQuery] = useState('')
    const [stationAssignmentsPage, setStationAssignmentsPage] = useState(1)
    const [customerAssignments, setCustomerAssignments] = useState<CustomerVehicleAssignment[]>([])
    const [customerRequests, setCustomerRequests] = useState<CustomerVehicleRequest[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [stations, setStations] = useState<Station[]>([])
    const [customers, setCustomers] = useState<User[]>([])
    const deferredStationAssignmentsSearchQuery = useDeferredValue(stationAssignmentsSearchQuery.trim())
    const stationAssignmentsQueryParams = useMemo(() => {
        const params: Parameters<typeof useVehicles>[0] = {
            page: stationAssignmentsPage,
            limit: 10,
            sortBy: ['createdAt:DESC'],
            'filter.stationId': ['$not:$null'],
        }

        if (deferredStationAssignmentsSearchQuery) {
            params['filter.vehicleNumber'] = [`$or:$ilike:${deferredStationAssignmentsSearchQuery}`]
            params['filter.station.name'] = [`$or:$ilike:${deferredStationAssignmentsSearchQuery}`]
        }

        return params
    }, [deferredStationAssignmentsSearchQuery, stationAssignmentsPage])
    const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles(stationAssignmentsQueryParams)
    const { data: stationsData, isLoading: isStationsLoading } = useStations({ limit: 200, sortBy: ['createdAt:DESC'] })

    const loadData = useCallback(async () => {
        try {
            const [nextCA, nextCR, nextV, nextS, nextC] = await Promise.all([
                mockApi.listCustomerVehicleAssignments(),
                mockApi.listCustomerRequests(),
                mockApi.listVehicles(),
                mockApi.listStations(),
                mockApi.listUsers(),
            ])
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

    const stationAssignments = useMemo<StationAssignmentRow[]>(() => {
        return (vehiclesData?.data ?? [])
            .map((vehicle) => ({
                id: vehicle.id,
                vehicleId: vehicle.id,
                vehicleNumber: vehicle.vehicleNumber ?? vehicle.id,
                stationId: vehicle.stationId ?? '',
                stationName: vehicle.station?.name ?? stationsData?.data?.find((station) => station.id === vehicle.stationId)?.name ?? vehicle.stationId ?? 'Unknown station',
                assignedAt: vehicle.updatedAt ?? vehicle.createdAt ?? '',
                status: 'ASSIGNED',
            }))
    }, [stationsData?.data, vehiclesData?.data])

    const stationAssignmentsPaginationMeta = vehiclesData?.meta

    const handleStationAssignmentsSearchChange = useCallback((value: string) => {
        setStationAssignmentsSearchQuery(value)
        setStationAssignmentsPage(1)
    }, [])

    const getVehicleName = (id: string) => vehicles.find((v) => v.id === id)?.registrationNumber || id
    const getStationName = (id: string) => stations.find((s) => s.id === id)?.name || id
    const getCustomerName = (id: string) => customers.find((c) => c.id === id)?.name || id

    if (isVehiclesLoading || isStationsLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Assignments...</div>
    }

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
                        searchValue={stationAssignmentsSearchQuery}
                        onSearchChange={handleStationAssignmentsSearchChange}
                        searchPlaceholder="Search by vehicle number or station..."
                        emptyMessage="No station assignments found."
                        currentPage={stationAssignmentsPaginationMeta?.currentPage ?? stationAssignmentsPage}
                        totalPages={stationAssignmentsPaginationMeta?.totalPages ?? 1}
                        totalItems={stationAssignmentsPaginationMeta?.totalItems ?? stationAssignments.length}
                        onPageChange={setStationAssignmentsPage}
                        columns={[
                            { header: 'Vehicle Number', cell: (a) => <span className="font-mono font-bold text-slate-700">{a.vehicleNumber}</span> },
                            { header: 'Operational Hub', cell: (a) => <span className="font-medium">{a.stationName}</span> },
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
