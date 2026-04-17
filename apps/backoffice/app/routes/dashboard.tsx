import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import {
    IconBatteryCharging,
    IconClipboardList,
    IconMapPin,
    IconMotorbike,
    IconReceiptRupee,
    IconUsers,
    IconActivity,
    IconTimeline,
    IconAlertCircle,
    IconChevronRight,
    IconRouteSquare
} from '@tabler/icons-react'

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

import { PageHeader } from '~/components/ui/page-header'
import { ResourceTable } from '~/components/ui/resource-table'
import { StatCard } from '~/components/ui/stat-card'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { mockApi } from '~/services/mockApi'
import type {
    CustomerRequest,
    DashboardSummary,
    MaintenanceRecord,
    Station,
    User,
    Vehicle,
} from '~/types/admin'

const telemetryData = [
    { time: '00:00', load: 20, active: 15 },
    { time: '04:00', load: 35, active: 20 },
    { time: '08:00', load: 85, active: 75 },
    { time: '12:00', load: 95, active: 88 },
    { time: '16:00', load: 80, active: 65 },
    { time: '20:00', load: 60, active: 45 },
    { time: '24:00', load: 30, active: 25 },
]

export default function DashboardRoute() {
    const navigate = useNavigate()
    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [requests, setRequests] = useState<CustomerRequest[]>([])
    const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [stations, setStations] = useState<Station[]>([])

    useEffect(() => {
        const load = async () => {
            const [nextSummary, nextRequests, nextMaintenance, nextUsers, nextVehicles, nextStations] =
                await Promise.all([
                    mockApi.getDashboardSummary(),
                    mockApi.listCustomerRequests(),
                    mockApi.listMaintenance(),
                    mockApi.listUsers(),
                    mockApi.listVehicles(),
                    mockApi.listStations(),
                ])

            setSummary(nextSummary)
            setRequests(nextRequests)
            setMaintenance(nextMaintenance)
            setUsers(nextUsers)
            setVehicles(nextVehicles)
            setStations(nextStations)
        }

        void load()
    }, [])

    const getUserName = (userId: string) => users.find((user) => user.id === userId)?.name ?? 'Unknown user'
    const getVehicleName = (vehicleId: string) =>
        vehicles.find((vehicle) => vehicle.id === vehicleId)?.registrationNumber ?? 'Unknown vehicle'
    const getStationName = (stationId: string) => stations.find((station) => station.id === stationId)?.name ?? 'Unknown station'

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <PageHeader
                    title='Operations Dashboard'
                    description='Real-time telemetry and fleet metrics across the YUGO network.'
                />
                <div className="flex items-center gap-3 rounded-2xl bg-white/50 p-1.5 border border-white/80 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        System Live
                    </div>
                    <div className="h-4 w-px bg-border/40" />
                    <span className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                        Last Sync: Just now
                    </span>
                </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
                <StatCard
                    title='Total Fleet'
                    value={summary?.activeUsers ?? 0}
                    helper='Active riders and employee accounts'
                    icon={<IconUsers size={24} />}
                    trend={{ value: '+12.5%', positive: true }}
                />
                <StatCard
                    title='Network Nodes'
                    value={summary?.activeStations ?? 0}
                    helper='Hubs, swap stations, and service points'
                    icon={<IconMapPin size={24} />}
                />
                <StatCard
                    title='Commercial Growth'
                    value={summary?.activePlans ?? 0}
                    helper='Active subscription and lease plans'
                    icon={<IconReceiptRupee size={24} />}
                    trend={{ value: '+4.2%', positive: true }}
                />
                <StatCard
                    title='Inventory Ready'
                    value={summary?.availableVehicles ?? 0}
                    helper='Units available for customer matching'
                    icon={<IconMotorbike size={24} />}
                    trend={{ value: '-2.1%', positive: false }}
                />
                <StatCard
                    title='Battery Pool'
                    value={summary?.availableBatteries ?? 0}
                    helper='Fully charged units in station slots'
                    icon={<IconBatteryCharging size={24} />}
                />
                <StatCard
                    title='Pending Tasks'
                    value={summary?.pendingRequests ?? 0}
                    helper='Service requests and allocation tasks'
                    icon={<IconClipboardList size={24} />}
                />
            </div>

            <div className='grid gap-4 lg:grid-cols-3 xl:grid-cols-4'>
                <div className='lg:col-span-2 xl:col-span-3 space-y-4'>
                    <div className="rounded-3xl border border-border/40 bg-white/60 p-1 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border/10 bg-white/20">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                                    <IconActivity size={18} />
                                </div>
                                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Critical Operations Queue</h3>
                            </div>
                            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5">
                                View Full Log <IconChevronRight size={14} className="ml-1" />
                            </Button>
                        </div>
                        
                        <div className="p-0">
                            <ResourceTable
                                title=""
                                data={requests.filter(r => r.status === 'PENDING').slice(0, 5)}
                                emptyMessage='No pending requests detected.'
                                className="border-0 shadow-none bg-transparent"
                                columns={[
                                    { 
                                        header: 'Customer', 
                                        cell: (r) => (
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-secondary/20 text-secondary-foreground flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter">
                                                    {getUserName(r.customerId).slice(0,2)}
                                                </div>
                                                <span className="font-semibold text-sm">{getUserName(r.customerId)}</span>
                                            </div>
                                        ) 
                                    },
                                    { header: 'Preferred Hub', cell: (r) => <span className="text-muted-foreground text-sm">{getStationName(r.preferredStationId)}</span> },
                                    { 
                                        header: 'Priority', 
                                        cell: (r) => (
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase">
                                                High Priority
                                            </div>
                                        ) 
                                    },
                                    { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
                                ]}
                            />
                        </div>
                    </div>

                    <Card className='border-border/40 shadow-sm bg-white overflow-hidden'>
                        <CardHeader className='pb-3 border-b border-border/10'>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IconActivity className="text-primary" size={18} />
                                    <CardTitle className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>Network Load Telemetry (24h)</CardTitle>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-muted-foreground">System Load</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        <span className="text-muted-foreground">Active Riders</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='pt-6'>
                            <div className="h-[260px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--border) / 0.5)" />
                                        <XAxis 
                                            dataKey="time" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fill: 'oklch(var(--muted-foreground))', fontWeight: 600 }} 
                                            dy={10} 
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fill: 'oklch(var(--muted-foreground))', fontWeight: 600 }} 
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                borderRadius: '16px', 
                                                border: '1px solid oklch(var(--border) / 0.5)', 
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' 
                                            }}
                                            labelStyle={{ fontWeight: 'bold', color: 'oklch(var(--foreground))', marginBottom: '8px' }}
                                        />
                                        <Area type="monotone" dataKey="load" name="System Load (%)" stroke="oklch(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                                        <Area type="monotone" dataKey="active" name="Active Riders" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                         <ResourceTable
                            title='Work in Progress (Service)'
                            data={maintenance.filter((m) => m.status === 'IN_PROGRESS').slice(0, 4)}
                            emptyMessage='All assets are currently healthy.'
                            columns={[
                                { header: 'Asset ID', cell: (m) => <span className="font-mono text-xs font-bold">{getVehicleName(m.vehicleId)}</span> },
                                { header: 'Issue', accessor: 'issueDescription' },
                                { header: 'Status', cell: (m) => <StatusBadge status={m.status} /> },
                            ]}
                        />
                         <Card className='border-border/40 shadow-sm bg-white overflow-hidden'>
                            <CardHeader className='pb-3 border-b border-border/10'>
                                <div className="flex items-center gap-2">
                                    <IconTimeline className="text-blue-500" size={18} />
                                    <CardTitle className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>Utilization Analytics</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className='pt-6'>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-foreground">Fleet Operational Capacity</span>
                                            <span className="text-xs font-bold text-primary">78%</span>
                                        </div>
                                        <div className='h-2 w-full rounded-full bg-primary/10 overflow-hidden'>
                                            <div className='h-full w-[78%] rounded-full bg-primary shadow-sm shadow-primary/20' />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-foreground">Station Battery Density</span>
                                            <span className="text-xs font-bold text-green-600">92%</span>
                                        </div>
                                        <div className='h-2 w-full rounded-full bg-green-500/10 overflow-hidden'>
                                            <div className='h-full w-[92%] rounded-full bg-green-500 shadow-sm shadow-green-200' />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-foreground">Pending Logistical Tasks</span>
                                            <span className="text-xs font-bold text-orange-500">22%</span>
                                        </div>
                                        <div className='h-2 w-full rounded-full bg-orange-500/10 overflow-hidden'>
                                            <div className='h-full w-[22%] rounded-full bg-orange-500 shadow-sm shadow-orange-200' />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className='flex flex-col gap-4'>
                    <Card className='border-border/40 bg-slate-900 text-white shadow-xl shadow-slate-200/50 overflow-hidden relative'>
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                            <IconRouteSquare size={120} />
                        </div>
                        <CardHeader className='pb-4 relative'>
                            <CardTitle className='text-[10px] font-bold uppercase tracking-[0.2em] text-white/50'>Control Surface</CardTitle>
                            <h4 className="text-lg font-bold mt-1">Quick Action Hub</h4>
                        </CardHeader>
                        <CardContent className='grid gap-3 relative'>
                            <Button className='w-full justify-between gap-3 h-12 px-5 bg-white/10 hover:bg-white/20 border-white/5 text-white' onClick={() => navigate('/users')}>
                                <div className="flex items-center gap-3">
                                    <div className='rounded-lg bg-blue-400 p-1.5 text-slate-950 shadow-lg shadow-blue-400/20'>
                                        <IconUsers className='h-4 w-4' />
                                    </div>
                                    <span className='text-sm font-semibold'>Personnel Matrix</span>
                                </div>
                                <IconChevronRight size={14} className="opacity-40" />
                            </Button>
                            <Button className='w-full justify-between gap-3 h-12 px-5 bg-white/10 hover:bg-white/20 border-white/5 text-white' onClick={() => navigate('/vehicles')}>
                                <div className="flex items-center gap-3">
                                    <div className='rounded-lg bg-orange-400 p-1.5 text-slate-950 shadow-lg shadow-orange-400/20'>
                                        <IconMotorbike className='h-4 w-4' />
                                    </div>
                                    <span className='text-sm font-semibold'>Fleet Registry</span>
                                </div>
                                <IconChevronRight size={14} className="opacity-40" />
                            </Button>
                            <Button className='w-full justify-between gap-3 h-12 px-5 bg-white/10 hover:bg-white/20 border-white/5 text-white' onClick={() => navigate('/batteries')}>
                                <div className="flex items-center gap-3">
                                    <div className='rounded-lg bg-green-400 p-1.5 text-slate-950 shadow-lg shadow-green-400/20'>
                                        <IconBatteryCharging className='h-4 w-4' />
                                    </div>
                                    <span className='text-sm font-semibold'>Energy Grid</span>
                                </div>
                                <IconChevronRight size={14} className="opacity-40" />
                            </Button>
                            <Button className='w-full justify-between gap-3 h-12 px-5 bg-white/10 hover:bg-white/20 border-white/5 text-white' onClick={() => navigate('/stations')}>
                                <div className="flex items-center gap-3">
                                    <div className='rounded-lg bg-purple-400 p-1.5 text-slate-950 shadow-lg shadow-purple-400/20'>
                                        <IconMapPin className='h-4 w-4' />
                                    </div>
                                    <span className='text-sm font-semibold'>Node Control</span>
                                </div>
                                <IconChevronRight size={14} className="opacity-40" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className='border-border/40 bg-white shadow-sm overflow-hidden'>
                         <CardHeader className='pb-2 border-b border-border/10'>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <CardTitle className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>System Health Pulse</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className='pt-4 pb-4 space-y-4'>
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        <span className='text-muted-foreground font-medium'>Database Layer</span>
                                    </div>
                                    <span className='text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full'>OPTIMAL</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        <span className='text-muted-foreground font-medium'>API Discovery</span>
                                    </div>
                                    <span className='text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full'>OPTIMAL</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                                        <span className='text-muted-foreground font-medium'>Telemetry Relay</span>
                                    </div>
                                    <span className='text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full'>LATENCY</span>
                                </div>
                            </div>
                            
                            <div className="pt-4 mt-4 border-t border-border/40">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                                        <IconAlertCircle size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-foreground leading-none">Diagnostic Warning</span>
                                        <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                                            Telemetry relay is experiencing higher than usual latency in the South Zone Hubs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
