import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import {
    IconBatteryCharging,
    IconClipboardList,
    IconMapPin,
    IconMotorbike,
    IconRouteSquare,
    IconTrendingUp,
    IconUsers,
} from '@tabler/icons-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useBatteries } from '~/queries/batteries'
import { useBookings } from '~/queries/bookings'
import { useStations } from '~/queries/stations'
import { useSurrenders } from '~/queries/surrender'
import { useUsers } from '~/queries/users'
import { useVehicles } from '~/queries/vehicles'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { PageHeader } from '~/components/ui/page-header'
import { StatCard } from '~/components/ui/stat-card'

function normalizeStatus(status?: string) {
    return (status ?? '').trim().toUpperCase()
}

function safeTotal<T extends { meta?: { totalItems?: number }; data?: unknown[] }>(response: T | undefined) {
    return response?.meta?.totalItems ?? response?.data?.length ?? 0
}

export default function DashboardRoute() {
    const navigate = useNavigate()

    const listParams = useMemo(
        () => ({
            page: 1,
            limit: 500,
            sortBy: ['createdAt:DESC'] as ('createdAt:DESC')[],
        }),
        [],
    )

    const { data: usersResponse, isLoading: usersLoading } = useUsers(listParams)
    const { data: stationsResponse, isLoading: stationsLoading } = useStations(listParams)
    const { data: vehiclesResponse, isLoading: vehiclesLoading } = useVehicles(listParams)
    const { data: batteriesResponse, isLoading: batteriesLoading } = useBatteries(listParams)
    const { data: bookingsResponse, isLoading: bookingsLoading } = useBookings(listParams)
    const { data: surrendersResponse, isLoading: surrendersLoading } = useSurrenders(listParams)

    const users = usersResponse?.data ?? []
    const bookings = bookingsResponse?.data ?? []

    const totalUsers = safeTotal(usersResponse)
    const totalStations = safeTotal(stationsResponse)
    const totalVehicles = safeTotal(vehiclesResponse)
    const totalBatteries = safeTotal(batteriesResponse)
    const totalBookings = safeTotal(bookingsResponse)
    const totalSurrenders = safeTotal(surrendersResponse)

    const pendingBookings = bookings.filter((booking) => normalizeStatus(booking.status).includes('PENDING')).length
    const completedBookings = bookings.filter((booking) => normalizeStatus(booking.status).includes('COMPLETED')).length

    const chartData = useMemo(() => {
        const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
        const buckets = labels.map((label) => ({ time: label, bookings: 0, pending: 0 }))

        bookings.forEach((booking) => {
            const createdAt = booking.createdAt ? new Date(booking.createdAt) : null
            if (!createdAt || Number.isNaN(createdAt.getTime())) return

            const bucketIndex = Math.floor(createdAt.getHours() / 4)
            const bucket = buckets[bucketIndex]
            if (!bucket) return

            bucket.bookings += 1
            if (normalizeStatus(booking.status).includes('PENDING')) {
                bucket.pending += 1
            }
        })

        return buckets
    }, [bookings])

    if (usersLoading || stationsLoading || vehiclesLoading || batteriesLoading || bookingsLoading || surrendersLoading) {
        return (
            <div className='p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase'>
                Loading dashboard...
            </div>
        )
    }

    return (
        <div className='space-y-8 pb-12'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <PageHeader
                    title='Operations Dashboard'
                    description='Live section counts and booking trend from backend data.'
                />
                <div className='flex items-center gap-3 rounded-2xl border border-white/80 bg-white/50 p-1.5 shadow-sm backdrop-blur-sm'>
                    <div className='flex items-center gap-2 rounded-xl bg-green-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-green-700'>
                        <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-green-500' />
                        System Live
                    </div>
                    <div className='h-4 w-px bg-border/40' />
                    <span className='px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                        Last Sync: {new Date().toLocaleTimeString('en-IN')}
                    </span>
                </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
                <StatCard title='Users' value={totalUsers} helper='Total user accounts' icon={<IconUsers size={24} />} onClick={() => navigate('/users')} />
                <StatCard title='Bookings' value={totalBookings} helper='Total bookings created' icon={<IconClipboardList size={24} />} onClick={() => navigate('/bookings')} />
                <StatCard title='Vehicles' value={totalVehicles} helper='Total fleet vehicles' icon={<IconMotorbike size={24} />} onClick={() => navigate('/vehicles')} />
                <StatCard title='Batteries' value={totalBatteries} helper='Total battery inventory' icon={<IconBatteryCharging size={24} />} onClick={() => navigate('/batteries')} />
                <StatCard title='Surrenders' value={totalSurrenders} helper='Total surrender requests' icon={<IconRouteSquare size={24} />} onClick={() => navigate('/surrender')} />
                <StatCard title='Stations' value={totalStations} helper='Total network stations' icon={<IconMapPin size={24} />} onClick={() => navigate('/stations')} />
            </div>

            <Card className='overflow-hidden border-border/40 bg-white shadow-sm'>
                <CardHeader className='border-b border-border/10 pb-3'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <IconTrendingUp className='text-primary' size={18} />
                            <CardTitle className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>Booking Trend (24h)</CardTitle>
                        </div>
                        <div className='flex items-center gap-5 text-[10px] font-bold uppercase tracking-wider'>
                            <span className='text-muted-foreground'>Pending: {pendingBookings}</span>
                            <span className='text-muted-foreground'>Completed: {completedBookings}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='pt-6'>
                    <div className='h-[300px] w-full'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id='bookingsGradient' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='5%' stopColor='oklch(var(--primary))' stopOpacity={0.35} />
                                        <stop offset='95%' stopColor='oklch(var(--primary))' stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id='pendingGradient' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='5%' stopColor='#f97316' stopOpacity={0.35} />
                                        <stop offset='95%' stopColor='#f97316' stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='oklch(var(--border) / 0.5)' />
                                <XAxis dataKey='time' axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'oklch(var(--muted-foreground))', fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'oklch(var(--muted-foreground))', fontWeight: 600 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid oklch(var(--border) / 0.5)',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                    }}
                                    labelStyle={{ fontWeight: 'bold', color: 'oklch(var(--foreground))', marginBottom: '8px' }}
                                />
                                <Area type='monotone' dataKey='bookings' name='Bookings' stroke='oklch(var(--primary))' strokeWidth={3} fillOpacity={1} fill='url(#bookingsGradient)' />
                                <Area type='monotone' dataKey='pending' name='Pending' stroke='#f97316' strokeWidth={3} fillOpacity={1} fill='url(#pendingGradient)' />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className='relative overflow-hidden border-border/40 bg-slate-900 text-white shadow-xl shadow-slate-200/50'>
                <div className='absolute right-0 top-0 p-8 opacity-10 rotate-12'>
                    <IconRouteSquare size={120} />
                </div>
                <CardHeader className='relative pb-4'>
                    <CardTitle className='text-[10px] font-bold uppercase tracking-[0.2em] text-white/50'>Control Surface</CardTitle>
                    <h4 className='mt-1 text-lg font-bold'>Quick Action Hub</h4>
                </CardHeader>
                <CardContent className='relative grid gap-3 md:grid-cols-3'>
                    <Button className='h-12 justify-between gap-3 border-white/5 bg-white/10 px-5 text-white hover:bg-white/20' onClick={() => navigate('/users')}>
                        <span className='text-sm font-semibold'>Personnel Matrix</span>
                    </Button>
                    <Button className='h-12 justify-between gap-3 border-white/5 bg-white/10 px-5 text-white hover:bg-white/20' onClick={() => navigate('/vehicles')}>
                        <span className='text-sm font-semibold'>Fleet Registry</span>
                    </Button>
                    <Button className='h-12 justify-between gap-3 border-white/5 bg-white/10 px-5 text-white hover:bg-white/20' onClick={() => navigate('/surrender')}>
                        <span className='text-sm font-semibold'>Surrender Desk</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
