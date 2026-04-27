import { useNavigate, useParams } from 'react-router'
import {
    IconArrowLeft,
    IconCalendarEvent,
    IconCar,
    IconEdit,
    IconMapPin,
    IconShieldCheck,
} from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useGetVehicleById } from '~/queries/vehicles'
import { formatDate, formatLabel } from '~/lib/formatter'

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-border/40 py-3 last:border-0">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="max-w-[62%] break-all text-right text-sm font-semibold text-foreground">{value ?? '—'}</span>
        </div>
    )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">{children}</h4>
}

function MetaPill({ icon: Icon, children }: { icon: typeof IconCar; children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
            <Icon size={15} className="text-primary" />
            <span>{children}</span>
        </span>
    )
}

function StatTile({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon: typeof IconCar }) {
    return (
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={18} />
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
            <div className="mt-1 text-lg font-semibold text-foreground">{value ?? '—'}</div>
        </div>
    )
}

export default function VehicleViewRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: vehicle, isLoading } = useGetVehicleById(id)

    if (isLoading) {
        return (
            <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">
                Loading Vehicle...
            </div>
        )
    }

    if (!vehicle) {
        return (
            <div className="p-8 text-center text-muted-foreground font-bold tracking-widest text-sm uppercase">
                Vehicle not found
            </div>
        )
    }

    const props = vehicle.properties ?? {}
    const brand = props.brand ?? '—'
    const model = props.model ?? '—'
    const vehicleLabel = [brand, model].filter((v) => v !== '—').join(' ') || 'Vehicle'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/vehicles')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title={vehicle.vehicleNumber ?? vehicleLabel}
                    description="Full details for this fleet vehicle."
                />
                <Button
                    variant="outline"
                    className="ml-auto shrink-0"
                    onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}>
                    <IconEdit size={16} className="mr-2" />
                    Edit
                </Button>
            </div>

            {/* Summary card */}
            <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                <CardHeader className="border-b border-border/40">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl">{vehicle.vehicleNumber ?? vehicleLabel}</CardTitle>
                            <CardDescription className="mt-1">{vehicleLabel}</CardDescription>
                        </div>
                        {vehicle.type ? <StatusBadge status={formatLabel(vehicle.type)} /> : null}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {vehicle.station?.name ? (
                            <MetaPill icon={IconMapPin}>{vehicle.station.name}</MetaPill>
                        ) : null}
                        {props.insuranceExpiry ? (
                            <MetaPill icon={IconShieldCheck}>Insurance: {props.insuranceExpiry}</MetaPill>
                        ) : null}
                        {vehicle.createdAt ? (
                            <MetaPill icon={IconCalendarEvent}>Registered {formatDate(vehicle.createdAt)}</MetaPill>
                        ) : null}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <StatTile label="Brand" value={brand} icon={IconCar} />
                        <StatTile label="Model" value={model} icon={IconCar} />
                        <StatTile label="Type" value={vehicle.type ? formatLabel(vehicle.type) : '—'} icon={IconCar} />
                        <StatTile
                            label="Station"
                            value={vehicle.station?.name ?? '—'}
                            icon={IconMapPin}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Details grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Vehicle Information</CardTitle>
                        <CardDescription>Registration, chassis, and identification data.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <SectionLabel>Identifiers</SectionLabel>
                        <DetailRow label="Vehicle ID" value={vehicle.id} />
                        <DetailRow label="Registration Number" value={vehicle.vehicleNumber} />
                        <DetailRow label="RC Number" value={vehicle.rcNumber} />
                        <DetailRow label="Chassis Number" value={vehicle.chassisNumber} />
                        <DetailRow label="GPS ID" value={vehicle.gpsId} />
                        <DetailRow label="Type" value={vehicle.type ? formatLabel(vehicle.type) : null} />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Specifications &amp; Assignment</CardTitle>
                        <CardDescription>Make, model, insurance, and current station.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <SectionLabel>Specifications</SectionLabel>
                        <DetailRow label="Brand" value={props.brand} />
                        <DetailRow label="Model" value={props.model} />
                        <DetailRow label="Insurance Expiry" value={props.insuranceExpiry} />

                        <SectionLabel className="mt-6">Station Assignment</SectionLabel>
                        <DetailRow label="Station ID" value={vehicle.stationId} />
                        <DetailRow label="Station Name" value={vehicle.station?.name} />
                        <DetailRow label="Station Type" value={vehicle.station?.type ? formatLabel(vehicle.station.type) : null} />
                    </CardContent>
                </Card>
            </div>

            {/* Timestamps */}
            <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                <CardHeader className="border-b border-border/40">
                    <CardTitle>Audit</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                        <DetailRow label="Created At" value={vehicle.createdAt ? formatDate(vehicle.createdAt) : null} />
                        <DetailRow label="Updated At" value={vehicle.updatedAt ? formatDate(vehicle.updatedAt) : null} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
