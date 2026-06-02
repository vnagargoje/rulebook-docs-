import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft, IconEdit, IconMapPin, IconUser, IconUsers, IconTrash } from '@tabler/icons-react'


import { PageHeader } from '~/components/ui/page-header'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { DetailRow } from '~/components/ui/detail-row'
import { MetaPill } from '~/components/ui/meta-pill'
import { SectionLabel } from '~/components/ui/section-label'
import { StatTile } from '~/components/ui/stat-tile'
import { useGetStationById, type StationDetail } from '~/queries/stations'
import { formatLabel } from '~/lib/formatter'
import { getStationEditPath } from '~/constants'
import { useRemoveStationManager } from '~/hooks/use-remove-station-manager'
import { ConfirmDialog } from '~/components/ui/confirm-dialog'

function formatStationAddress(station: StationDetail) {
    const address = station.address

    if (!address) {
        return '—'
    }

    return [
        address.lineOne,
        address.lineTwo,
        address.city?.name,
        address.city?.state?.name,
        address.pincode,
    ].filter(Boolean).join(', ') || '—'
}

export default function HubStationsViewRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: station, isLoading } = useGetStationById(id)
    const { promptRemove, cancelRemove, confirmRemove, removingManagerId, isRemoving } = useRemoveStationManager(id!)

    if (isLoading) {
        return (
            <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">
                Loading Station...
            </div>
        )
    }

    if (!station) {
        return (
            <div className="p-8 text-center text-muted-foreground font-bold tracking-widest text-sm uppercase">
                Station not found
            </div>
        )
    }

    const stationAddress = formatStationAddress(station)
    const managers = station.managers ?? []

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader title={station.name} description="Full details for this station." />
                <Button
                    variant="outline"
                    className="ml-auto shrink-0"
                    onClick={() => navigate(getStationEditPath(station.type, station.id))}>
                    <IconEdit size={16} className="mr-2" />
                    Edit
                </Button>
            </div>

            <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                <CardHeader className="border-b border-border/40">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl">{station.name}</CardTitle>
                            <CardDescription className="mt-1">Station overview and assigned managers.</CardDescription>
                        </div>
                        <StatusBadge status={station.active ? 'ACTIVE' : 'INACTIVE'} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <MetaPill icon={IconMapPin}>{stationAddress}</MetaPill>
                        <MetaPill icon={IconUsers}>{managers.length} Assigned Manager{managers.length === 1 ? '' : 's'}</MetaPill>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <StatTile label="Station Type" value={formatLabel(station.type)} icon={IconMapPin} />
                        <StatTile label="City" value={station.address?.city?.name ?? '—'} icon={IconMapPin} />
                        <StatTile label="Managers" value={String(managers.length)} icon={IconUsers} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Station Details</CardTitle>
                        <CardDescription>Core station information and address details.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <SectionLabel>Overview</SectionLabel>
                        <DetailRow label="Station Name" value={station.name} />
                        <DetailRow label="Station Type" value={formatLabel(station.type)} />
                        <DetailRow label="Address" value={stationAddress} />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Assigned Managers</CardTitle>
                        <CardDescription>Employees currently assigned to this station.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <SectionLabel>Manager List</SectionLabel>
                        {managers.length ? (
                            <div className="space-y-3">
                                {managers.map((manager) => {
                                    const managerName = [manager.firstName, manager.lastName].filter(Boolean).join(' ') || 'Unnamed Manager'
                                    const managerMeta = manager.email || manager.mobilenumber || manager.id

                                    return (
                                        <div key={manager.id} className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/20 p-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <IconUser size={18} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-foreground">{managerName}</p>
                                                <p className="text-sm text-muted-foreground break-all">{managerMeta}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
                                                onClick={() => promptRemove(manager.id)}
                                                disabled={removingManagerId === manager.id}
                                            >
                                                <IconTrash size={16} className="mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-sm font-medium text-muted-foreground">No managers assigned to this station.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <ConfirmDialog 
                isOpen={!!removingManagerId}
                isLoading={isRemoving}
                title="Remove Manager"
                description="Are you sure you want to remove this manager from the station?"
                confirmText="Yes, Remove"
                loadingText="Removing..."
                variant="destructive"
                onClose={cancelRemove}
                onConfirm={confirmRemove}
            />
        </div>
    )
}
