import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { IconPlus, IconEdit, IconBatteryCharging, IconMapPin } from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { mockApi } from '~/services/mockApi'
import { type Battery, type BatteryStationAssignment, type Station } from '~/types/admin'
import { toast } from 'sonner'
import { formatDate } from '~/lib/formatter'

export default function BatteriesListRoute() {
    const navigate = useNavigate()
    const [batteries, setBatteries] = useState<Battery[]>([])
    const [stations, setStations] = useState<Station[]>([])
    const [assignments, setAssignments] = useState<BatteryStationAssignment[]>([])

    const loadData = useCallback(async () => {
        try {
            const [nextBatteries, nextStations, nextAssignments] = await Promise.all([
                mockApi.listBatteries(),
                mockApi.listStations(),
                mockApi.listBatteryAssignments(),
            ])
            setBatteries(nextBatteries)
            setStations(nextStations)
            setAssignments(nextAssignments)
        } catch (error) {
            toast.error('Failed to load battery inventory')
        }
    }, [])

    useEffect(() => {
        void loadData()
    }, [loadData])

    const getStationName = (id: string) => stations.find((s) => s.id === id)?.name || id

    return (
        <div className="space-y-8">
            <PageHeader
                title="Battery Operations"
                description="Manage battery lifecycle, charging status, and station allocations across the network."
                actions={
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => navigate('/batteries/assign')}>
                            Assign Batteries
                        </Button>
                        <Button onClick={() => navigate('/batteries/create')}>
                            <IconPlus className="mr-2 h-4 w-4" />
                            Add Battery
                        </Button>
                    </div>
                }
            />

            <Tabs defaultValue="inventory" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="inventory" className="gap-2">
                        <IconBatteryCharging size={18} />
                        Battery Inventory
                    </TabsTrigger>
                    <TabsTrigger value="assignments" className="gap-2">
                        <IconMapPin size={18} />
                        Station Allocations
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-4">
                    <ResourceTable
                        data={batteries}
                        searchFields={['batteryCode']}
                        searchPlaceholder="Search by battery code..."
                        filterConfigs={[
                            {
                                field: 'status',
                                label: 'Status',
                                options: [
                                    { label: 'Available', value: 'AVAILABLE' },
                                    { label: 'Needs Charge', value: 'NEEDS_CHARGE' },
                                    { label: 'In Use', value: 'IN_USE' },
                                ]
                            }
                        ]}
                        emptyMessage="No batteries in inventory."
                        columns={[
                            { header: 'Code', accessor: 'batteryCode' },
                            { header: 'Capacity', cell: (b) => <span className="font-bold text-slate-700">{b.capacityAh}Ah</span> },
                            { header: 'Range', cell: (b) => <span className="font-medium text-slate-600">{b.rangeKm} km</span> },
                            { header: 'Station', cell: (b) => b.stationId ? getStationName(b.stationId) : <span className="text-muted-foreground italic">Unassigned</span> },
                            { header: 'Status', cell: (b) => <StatusBadge status={b.status} /> },
                            {
                                header: 'Actions',
                                cell: (b) => (
                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/batteries/edit/${b.id}`)}>
                                        <IconEdit className="h-4 w-4" />
                                    </Button>
                                ),
                            },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="assignments" className="space-y-4">
                    <ResourceTable
                        data={assignments}
                        searchFields={['stationId']}
                        searchPlaceholder="Search by station ID..."
                        filterConfigs={[
                            {
                                field: 'status',
                                label: 'Status',
                                options: [
                                    { label: 'Active', value: 'ACTIVE' },
                                    { label: 'Inactive', value: 'INACTIVE' },
                                ]
                            }
                        ]}
                        emptyMessage="No allocations found."
                        columns={[
                            { header: 'Station', cell: (a) => <span className="font-bold">{getStationName(a.stationId)}</span> },
                            { header: 'Battery Count', cell: (a) => (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                        {a.batteryIds.length}
                                    </div>
                                    <span className="text-sm text-slate-600 font-medium">batteries</span>
                                </div>
                            )},
                            { header: 'Assigned At', cell: (a) => <span className="text-xs text-muted-foreground">{formatDate(a.assignedAt)}</span> },
                            { header: 'Status', cell: (a) => <StatusBadge status={a.status} /> },
                        ]}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
