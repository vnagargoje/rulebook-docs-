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
import { DetailRow } from '~/components/ui/detail-row'
import { StatTile } from '~/components/ui/stat-tile'
import { SectionLabel } from '~/components/ui/section-label'
import { MetaPill } from '~/components/ui/meta-pill'
import { useGetVehicleById } from '~/queries/vehicles'
import { formatDate, formatLabel } from '~/lib/formatter'

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
    const brand = props.brand ?? 'N/A'
    const model = props.model ?? 'N/A'
    const vehicleLabel = [brand, model].filter((v) => v !== 'N/A').join(' ') || 'Vehicle'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
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
                        <StatTile label="Type" value={vehicle.type ? formatLabel(vehicle.type) : 'N/A'} icon={IconCar} />
                        <StatTile
                            label="Station"
                            value={vehicle.station?.name ?? 'N/A'}
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
                    <div className="grid gap-x-6 gap-y-3 md:grid-cols-2">
                        <DetailRow label="Created At" value={vehicle.createdAt ? formatDate(vehicle.createdAt) : 'N/A'} />
                        <DetailRow label="Updated At" value={vehicle.updatedAt && vehicle.updatedAt !== vehicle.createdAt ? formatDate(vehicle.updatedAt) : 'N/A'} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
