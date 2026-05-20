import { useNavigate, useParams } from 'react-router'
import {
    IconArrowLeft,
    IconBattery,
    IconBuildingWarehouse,
    IconCalendarEvent,
    IconCheck,
    IconClock,
    IconMotorbike,
    IconTruckDelivery,
} from '@tabler/icons-react'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { PageHeader } from '~/components/ui/page-header'
import { StatusBadge } from '~/components/ui/status-badge'
import { BatteryQrChip } from '~/components/ui/battery-qr-chip'
import { StatTile } from '~/components/ui/stat-tile'
import { DetailRow } from '~/components/ui/detail-row'
import { Separator } from '~/components/ui/separator'
import { formatDate } from '~/lib/formatter'
import { useBatteryTransportDetail } from '~/queries/battery-transports'

export default function BatteryTransportViewRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: transport, isLoading } = useBatteryTransportDetail(id)

    if (isLoading) {
        return (
            <div className='p-8 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse'>
                Loading Transport...
            </div>
        )
    }

    if (!transport) {
        return (
            <div className='p-8 text-center text-muted-foreground'>
                Transport not found.
            </div>
        )
    }

    const stationTypeLabel = (type?: string) =>
        type ? type.replace(/_/g, ' ') : '—'

    const isDelivered = transport.status === 'delivered'

    return (
        <div className='mx-auto max-w-4xl space-y-6 pb-12'>
            <div className='flex items-center gap-4'>
                <Button variant='ghost' size='icon' onClick={() => navigate('/battery-transports')}>
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title='Transport Details'
                    description={`Movement ID: ${transport.id}`}
                />
            </div>

            {/* Hero card */}
            <Card className='overflow-hidden border-border/40 bg-linear-to-br from-primary/6 via-white to-white shadow-sm'>
                <CardContent className='p-6'>
                    <div className='flex flex-wrap items-start justify-between gap-4'>
                        <div className='space-y-2'>
                            <StatusBadge status={transport.status.toUpperCase()} />
                            <h2 className='text-2xl font-semibold tracking-tight text-foreground'>
                                {transport.fromStation?.name ?? '—'}
                                <span className='mx-2 text-muted-foreground'>→</span>
                                {transport.toStation?.name ?? '—'}
                            </h2>
                            <p className='text-sm text-muted-foreground'>
                                Dispatched on {transport.createdAt ? formatDate(transport.createdAt) : '—'}
                            </p>
                        </div>
                        <div className='text-right'>
                            <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>
                                Batteries
                            </p>
                            <p className='mt-1 text-4xl font-bold text-foreground'>{transport.batteryIds.length}</p>
                        </div>
                    </div>

                    <Separator className='my-5' />

                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                        <StatTile
                            label='Status'
                            value={<StatusBadge status={transport.status.toUpperCase()} />}
                            icon={isDelivered ? IconCheck : IconTruckDelivery}
                        />
                        <StatTile
                            label='Vehicle'
                            value={
                                <span className='font-mono text-sm'>
                                    {transport.vehicle?.vehicleNumber ?? '—'}
                                </span>
                            }
                            icon={IconMotorbike}
                        />
                        <StatTile
                            label='Dispatched'
                            value={transport.createdAt ? formatDate(transport.createdAt) : '—'}
                            icon={IconClock}
                        />
                        <StatTile
                            label='Received'
                            value={transport.receivedAt ? formatDate(transport.receivedAt) : '—'}
                            icon={IconCalendarEvent}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Stations */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <Card className='border-border/40 shadow-sm'>
                    <CardHeader className='pb-2'>
                        <CardTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground'>
                            <IconBuildingWarehouse size={15} />
                            From Station
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DetailRow label='Name' value={transport.fromStation?.name ?? '—'} />
                        <DetailRow
                            label='Type'
                            value={
                                <span className='capitalize'>{stationTypeLabel(transport.fromStation?.type)}</span>
                            }
                        />
                    </CardContent>
                </Card>

                <Card className='border-border/40 shadow-sm'>
                    <CardHeader className='pb-2'>
                        <CardTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground'>
                            <IconBuildingWarehouse size={15} />
                            To Station
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DetailRow label='Name' value={transport.toStation?.name ?? '—'} />
                        <DetailRow
                            label='Type'
                            value={
                                <span className='capitalize'>{stationTypeLabel(transport.toStation?.type)}</span>
                            }
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Batteries */}
            <Card className='border-border/40 shadow-sm'>
                <CardHeader className='pb-2'>
                    <CardTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground'>
                        <IconBattery size={15} />
                        Battery QR IDs
                        <span className='ml-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600'>
                            {transport.batteryIds.length}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {transport.batteryIds.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>No batteries in this transport.</p>
                    ) : (
                        <div className='flex flex-wrap gap-2'>
                            {transport.batteryIds.map((batteryId) => (
                                <BatteryQrChip key={batteryId} batteryId={batteryId} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
