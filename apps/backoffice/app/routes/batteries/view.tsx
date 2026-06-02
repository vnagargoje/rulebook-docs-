import { useNavigate, useParams } from 'react-router'
import {
    IconArrowLeft,
    IconBattery,
    IconBatteryCharging,
    IconCalendarEvent,
    IconEdit,
    IconMapPin,
    IconQrcode,
    IconShieldCheck,
    IconWeight,
} from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { StatusBadge } from '~/components/ui/status-badge'
import { DetailRow } from '~/components/ui/detail-row'
import { StatTile } from '~/components/ui/stat-tile'
import { SectionLabel } from '~/components/ui/section-label'
import { MetaPill } from '~/components/ui/meta-pill'
import { useGetBatteryById } from '~/queries/batteries'
import { formatDate, formatLabel } from '~/lib/formatter'

export default function BatteryViewRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: battery, isLoading } = useGetBatteryById(id)

    if (isLoading) {
        return (
            <div className='p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase'>
                Loading Battery...
            </div>
        )
    }

    if (!battery) {
        return (
            <div className='p-8 text-center text-muted-foreground font-bold tracking-widest text-sm uppercase'>
                Battery not found
            </div>
        )
    }

    const props = battery.properties
    const hasProperties = !!props
    const hasStation = !!battery.station || !!battery.stationId

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center gap-4'>
                <Button variant='ghost' size='icon' onClick={() => navigate(-1)} className='shrink-0'>
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader title={battery.batteryQrId} description='Full details for this battery unit.' />
                <Button
                    variant='outline'
                    className='ml-auto shrink-0'
                    onClick={() => navigate(`/batteries/edit/${battery.id}`)}>
                    <IconEdit size={16} className='mr-2' />
                    Edit
                </Button>
            </div>

            {/* Summary card */}
            <Card className='overflow-hidden border-border/40 bg-white shadow-sm'>
                <CardHeader className='border-b border-border/40'>
                    <div className='flex flex-wrap items-center justify-between gap-4'>
                        <div>
                            <CardTitle className='flex items-center gap-2 text-xl'>
                                <IconQrcode size={20} className='text-primary' />
                                {battery.batteryQrId}
                            </CardTitle>
                            <CardDescription className='mt-1'>Battery Unit</CardDescription>
                        </div>
                        {battery.station?.type ? <StatusBadge status={formatLabel(battery.station.type)} /> : null}
                    </div>
                    <div className='mt-4 flex flex-wrap gap-2'>
                        {battery.station?.name ? (
                            <MetaPill icon={IconMapPin}>{battery.station.name}</MetaPill>
                        ) : null}
                        {battery.gpsId ? <MetaPill icon={IconBattery}>GPS: {battery.gpsId}</MetaPill> : null}
                        {props?.removableOption !== undefined ? (
                            <MetaPill icon={IconShieldCheck}>
                                {props.removableOption ? 'Removable' : 'Non-Removable'}
                            </MetaPill>
                        ) : null}
                        {battery.createdAt ? (
                            <MetaPill icon={IconCalendarEvent}>Added {formatDate(battery.createdAt)}</MetaPill>
                        ) : null}
                    </div>
                </CardHeader>
                {hasProperties && (
                    <CardContent className='p-6'>
                        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                            <StatTile label='Capacity' value={props?.capacity} icon={IconBatteryCharging} />
                            <StatTile label='Range' value={props?.range} icon={IconBattery} />
                            <StatTile label='Charging Time' value={props?.chargingTime} icon={IconBatteryCharging} />
                            <StatTile label='Weight' value={props?.weight} icon={IconWeight} />
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Details grid */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* QR Code card */}
                <Card className='overflow-hidden border-border/40 bg-white shadow-sm'>
                    <CardHeader className='border-b border-border/40'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                                <IconQrcode size={20} />
                            </div>
                            <div>
                                <CardTitle className='text-lg'>Battery QR Code</CardTitle>
                                <CardDescription>Unique identifier encoded in the battery QR.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-4 p-6'>
                        {/* QR image or fallback */}
                        <div className='flex flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-dashed border-border bg-gradient-to-br from-muted/40 to-white p-8'>
                            {battery.qrCode?.path ? (
                                <img
                                    src={battery.qrCode.path}
                                    alt={`QR code for ${battery.batteryQrId}`}
                                    className='h-40 w-40 rounded-xl object-contain'
                                />
                            ) : (
                                <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                                    <IconQrcode size={36} />
                                </div>
                            )}
                            <div className='text-center'>
                                <div className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
                                    Battery QR ID
                                </div>
                                <div className='mt-2 font-mono text-2xl font-bold tracking-wider text-foreground'>
                                    {battery.batteryQrId}
                                </div>
                            </div>
                        </div>
                        {/* QR file path */}
                        {battery.qrCode?.path && (
                            <div className='rounded-2xl border border-border/50 bg-muted/20 p-4'>
                                <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                                    QR Code URL
                                </div>
                                <div className='mt-2 break-all text-sm font-medium text-foreground'>
                                    {battery.qrCode.path}
                                </div>
                            </div>
                        )}
                        {/* Reference */}
                        <div className='rounded-2xl border border-border/50 bg-muted/20 p-4'>
                            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                                Battery ID (internal)
                            </div>
                            <div className='mt-2 break-all text-sm font-medium text-foreground'>{battery.id}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Identifiers + GPS card */}
                <Card className='overflow-hidden border-border/40 bg-white shadow-sm'>
                    <CardHeader className='border-b border-border/40'>
                        <CardTitle>Battery Information</CardTitle>
                        <CardDescription>QR code, GPS and identification data.</CardDescription>
                    </CardHeader>
                    <CardContent className='p-6'>
                        <SectionLabel>Identifiers</SectionLabel>
                        <DetailRow label='Battery ID' value={battery.id} />
                        <DetailRow label='QR Code' value={battery.batteryQrId} />
                        <DetailRow label='GPS ID' value={battery.gpsId} />
                    </CardContent>
                </Card>

                {/* Specifications — only shown when properties exist */}
                {hasProperties && (
                    <Card className='overflow-hidden border-border/40 bg-white shadow-sm lg:col-span-2'>
                        <CardHeader className='border-b border-border/40'>
                            <CardTitle>Specifications</CardTitle>
                            <CardDescription>Technical properties and warranty details.</CardDescription>
                        </CardHeader>
                        <CardContent className='p-6'>
                            <div className='grid grid-cols-1 gap-x-12 sm:grid-cols-2'>
                                <div>
                                    <SectionLabel>Performance</SectionLabel>
                                    <DetailRow label='Capacity' value={props?.capacity} />
                                    <DetailRow label='Range' value={props?.range} />
                                    <DetailRow label='Charging Time' value={props?.chargingTime} />
                                    <DetailRow label='Weight' value={props?.weight} />
                                </div>
                                <div>
                                    <SectionLabel>Lifecycle &amp; Warranty</SectionLabel>
                                    <DetailRow label='Lifecycle' value={props?.lifecycle} />
                                    <DetailRow label='Mfg Date' value={props?.mfgDate} />
                                    <DetailRow label='Warranty' value={props?.warranty} />
                                    <DetailRow
                                        label='Removable'
                                        value={
                                            props?.removableOption !== undefined
                                                ? props.removableOption
                                                    ? 'Yes'
                                                    : 'No'
                                                : null
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Station assignment — only shown when assigned */}
            {hasStation && (
                <Card className='overflow-hidden border-border/40 bg-white shadow-sm'>
                    <CardHeader className='border-b border-border/40'>
                        <CardTitle>Station Assignment</CardTitle>
                        <CardDescription>Current station allocation for this battery.</CardDescription>
                    </CardHeader>
                    <CardContent className='p-6'>
                        <div className='grid grid-cols-1 gap-0 sm:grid-cols-3'>
                            <DetailRow label='Station ID' value={battery.stationId} />
                            <DetailRow label='Station Name' value={battery.station?.name} />
                            <DetailRow
                                label='Station Type'
                                value={battery.station?.type ? formatLabel(battery.station.type) : null}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Audit */}
            <Card className='overflow-hidden border-border/40 bg-white shadow-sm'>
                <CardHeader className='border-b border-border/40'>
                    <CardTitle>Audit</CardTitle>
                </CardHeader>
                <CardContent className='p-6'>
                    <div className='grid grid-cols-1 gap-0 sm:grid-cols-2'>
                        <DetailRow
                            label='Created At'
                            value={battery.createdAt ? formatDate(battery.createdAt) : null}
                        />
                        <DetailRow
                            label='Updated At'
                            value={battery.updatedAt ? formatDate(battery.updatedAt) : null}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
