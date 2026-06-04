import { useNavigate, useParams } from 'react-router'
import {
    IconArrowLeft,
    IconBolt,
    IconGps,
    IconMapPin,
    IconRefresh,
    IconSpeedboat,
    IconExternalLink,
} from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { StatusBadge } from '~/components/ui/status-badge'
import { StatTile } from '~/components/ui/stat-tile'
import { DetailRow } from '~/components/ui/detail-row'
import { SectionLabel } from '~/components/ui/section-label'
import { useGetBatteryById } from '~/queries/batteries'
import { formatDate, formatLabel } from '~/lib/formatter'

export default function BatteryTrackRoute() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: battery, isLoading, refetch, dataUpdatedAt } = useGetBatteryById(id)

    if (isLoading) {
        return (
            <div className='p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase'>
                Locating Battery...
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

    const props = (battery.properties || {}) as Record<string, any>
    const lat: number | null = props['lat'] != null ? parseFloat(props['lat']) : null
    const lng: number | null = props['long'] != null ? parseFloat(props['long']) : null
    const socPercent: number | null = props['socPercent'] ?? null
    const speed: number | null = props['speed'] ?? null

    const hasLocation = lat != null && lng != null

    const mapSrc = hasLocation
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`
        : null

    const googleMapsUrl = hasLocation
        ? `https://www.google.com/maps?q=${lat},${lng}`
        : null

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center gap-4'>
                <Button variant='ghost' size='icon' onClick={() => navigate(-1)} className='shrink-0'>
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title={`Track — ${battery.batteryQrId}`}
                    description='Live GPS location and telemetry data from Mooving IoT.'
                />
                <div className='ml-auto flex items-center gap-2 shrink-0'>
                    {googleMapsUrl && (
                        <Button variant='outline' size='sm' asChild>
                            <a href={googleMapsUrl} target='_blank' rel='noopener noreferrer'>
                                <IconExternalLink size={14} className='mr-1.5' />
                                Google Maps
                            </a>
                        </Button>
                    )}
                    <Button variant='outline' size='sm' onClick={() => refetch()}>
                        <IconRefresh size={14} className='mr-1.5' />
                        Refresh
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => navigate(`/batteries/${battery.id}`)}>
                        View Details
                    </Button>
                </div>
            </div>

            {/* Status bar */}
            <Card className='overflow-hidden border-border/40 bg-white shadow-sm'>
                <CardContent className='p-6'>
                    <div className='flex flex-wrap items-center justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                                <IconGps size={20} />
                            </div>
                            <div>
                                <div className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                                    Battery
                                </div>
                                <div className='font-mono font-bold text-foreground'>{battery.batteryQrId}</div>
                            </div>
                        </div>
                        <div className='flex flex-wrap items-center gap-3'>
                            <StatusBadge status={formatLabel(battery.status)} />
                            {battery.station?.name && (
                                <span className='rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground'>
                                    {battery.station.name}
                                </span>
                            )}
                            {dataUpdatedAt ? (
                                <span className='text-xs text-muted-foreground'>
                                    Updated {formatDate(new Date(dataUpdatedAt).toISOString())}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Telemetry tiles */}
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                <StatTile
                    label='State of Charge'
                    value={socPercent != null ? `${socPercent}%` : undefined}
                    icon={IconBolt}
                />
                <StatTile
                    label='Speed'
                    value={speed != null ? `${speed} km/h` : undefined}
                    icon={IconSpeedboat}
                />
                <StatTile
                    label='Latitude'
                    value={lat != null ? String(lat) : undefined}
                    icon={IconMapPin}
                />
                <StatTile
                    label='Longitude'
                    value={lng != null ? String(lng) : undefined}
                    icon={IconMapPin}
                />
            </div>

            {/* Map + details side by side */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                {/* Map — spans 2/3 */}
                <Card className='overflow-hidden border-border/40 bg-white shadow-sm lg:col-span-2'>
                    <CardHeader className='border-b border-border/40'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                                <IconMapPin size={20} />
                            </div>
                            <div>
                                <CardTitle className='text-lg'>Live Location</CardTitle>
                                <CardDescription>
                                    {hasLocation
                                        ? `${lat}, ${lng}`
                                        : 'No GPS data available — data is synced every 5 minutes.'}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='p-0'>
                        {mapSrc ? (
                            <iframe
                                src={mapSrc}
                                title={`Location of ${battery.batteryQrId}`}
                                className='h-[420px] w-full border-0'
                                loading='lazy'
                                referrerPolicy='no-referrer'
                            />
                        ) : (
                            <div className='flex h-[420px] flex-col items-center justify-center gap-4 bg-muted/20 text-muted-foreground'>
                                <IconGps size={48} className='opacity-20' />
                                <div className='text-center'>
                                    <div className='font-semibold'>No GPS Fix</div>
                                    <div className='mt-1 text-sm'>
                                        GPS coordinates are not yet available for this battery.
                                        <br />
                                        Data syncs automatically every 5 minutes.
                                    </div>
                                </div>
                                <Button variant='outline' size='sm' onClick={() => refetch()}>
                                    <IconRefresh size={14} className='mr-1.5' />
                                    Retry
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Battery info panel */}
                <Card className='overflow-hidden border-border/40 bg-white shadow-sm'>
                    <CardHeader className='border-b border-border/40'>
                        <CardTitle className='text-lg'>Battery Info</CardTitle>
                        <CardDescription>Identification and station assignment.</CardDescription>
                    </CardHeader>
                    <CardContent className='p-6 space-y-4'>
                        <SectionLabel>Identifiers</SectionLabel>
                        <DetailRow label='Battery Code' value={battery.batteryQrId} />
                        <DetailRow label='GPS Device ID' value={battery.gpsId} />
                        <DetailRow label='Internal ID' value={battery.id} />

                        {battery.station && (
                            <>
                                <SectionLabel>Station</SectionLabel>
                                <DetailRow label='Name' value={battery.station.name} />
                                <DetailRow
                                    label='Type'
                                    value={battery.station.type ? formatLabel(battery.station.type) : undefined}
                                />
                            </>
                        )}

                        {battery.properties?.capacity && (
                            <>
                                <SectionLabel>Specs</SectionLabel>
                                <DetailRow label='Capacity' value={battery.properties.capacity} />
                                <DetailRow label='Range' value={battery.properties.range} />
                                <DetailRow label='Charging Time' value={battery.properties.chargingTime} />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
