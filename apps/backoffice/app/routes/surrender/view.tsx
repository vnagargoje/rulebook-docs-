import { useNavigate, useParams } from 'react-router'
import {
    IconArrowLeft,
    IconCalendarEvent,
    IconCar,
    IconReceiptRupee,
    IconUser,
} from '@tabler/icons-react'

import { PageHeader } from '~/components/ui/page-header'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useSurrenderByBookingId } from '~/queries/surrender'
import { formatCurrency, formatDate } from '~/lib/formatter'
import { DetailRow } from '~/components/ui/detail-row'
import { StatTile } from '~/components/ui/stat-tile'
import { SectionLabel } from '~/components/ui/section-label'
import { MetaPill } from '~/components/ui/meta-pill'

export default function SurrenderViewRoute() {
    const { bookingId } = useParams()
    const navigate = useNavigate()
    const { data: surrender, isLoading } = useSurrenderByBookingId(bookingId)

    if (isLoading) {
        return (
            <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">
                Loading Surrender...
            </div>
        )
    }

    if (!surrender) {
        return (
            <div className="p-8 text-center text-muted-foreground font-bold tracking-widest text-sm uppercase">
                Surrender record not found
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title={surrender.vehicle?.vehicleNumber ?? surrender.vehicleId}
                    description="Full details for this vehicle surrender record."
                />
                {surrender.booking?.status ? (
                    <StatusBadge status={surrender.booking.status.toUpperCase()} />
                ) : null}
            </div>

            {/* Summary stat tiles */}
            <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                <CardHeader className="border-b border-border/40">
                    <CardTitle>Surrender Overview</CardTitle>
                    <CardDescription>Financial summary for this vehicle return.</CardDescription>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {surrender.vehicle?.vehicleNumber ? (
                            <MetaPill icon={IconCar}>{surrender.vehicle.vehicleNumber}</MetaPill>
                        ) : null}
                        {surrender.createdAt ? (
                            <MetaPill icon={IconCalendarEvent}>Surrendered {formatDate(surrender.createdAt)}</MetaPill>
                        ) : null}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <StatTile label="Penalty" value={formatCurrency(surrender.penalty)} icon={IconReceiptRupee} />
                        <StatTile label="Misc Charges" value={formatCurrency(surrender.miscCharges)} icon={IconReceiptRupee} />
                        <StatTile label="Refund Amount" value={formatCurrency(surrender.refundAmount)} icon={IconReceiptRupee} />
                    </div>
                </CardContent>
            </Card>

            {/* Detail cards */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Surrender Record</CardTitle>
                        <CardDescription>Reference IDs and financial breakdown.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <SectionLabel>Identifiers</SectionLabel>
                        <DetailRow label="Surrender ID" value={surrender.id} />
                        <DetailRow label="Booking ID" value={surrender.bookingId} />
                        <DetailRow label="Vehicle ID" value={surrender.vehicleId} />
                        <DetailRow label="Vehicle Number" value={surrender.vehicle?.vehicleNumber} />

                        <SectionLabel className="mt-5">Financials</SectionLabel>
                        <DetailRow label="Penalty" value={formatCurrency(surrender.penalty)} />
                        <DetailRow label="Misc Charges" value={formatCurrency(surrender.miscCharges)} />
                        <DetailRow label="Refund Amount" value={formatCurrency(surrender.refundAmount)} />
                        {surrender.notes ? (
                            <DetailRow label="Notes" value={surrender.notes} />
                        ) : null}
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Booking Info</CardTitle>
                        <CardDescription>Linked booking and user plan at time of surrender.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <SectionLabel>Booking</SectionLabel>
                        <DetailRow label="Booking ID" value={surrender.booking?.id} />
                        <DetailRow label="User Plan ID" value={surrender.booking?.userPlanId} />
                        <DetailRow
                            label="User ID"
                            value={
                                surrender.booking?.userId ? (
                                    <span className="inline-flex items-center gap-1">
                                        <IconUser size={13} className="text-muted-foreground" />
                                        {surrender.booking.userId}
                                    </span>
                                ) : null
                            }
                        />
                        <DetailRow
                            label="Status"
                            value={surrender.booking?.status ? <StatusBadge status={surrender.booking.status.toUpperCase()} /> : null}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Audit */}
            <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                <CardHeader className="border-b border-border/40">
                    <CardTitle>Audit</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                        <DetailRow label="Created At" value={formatDate(surrender.createdAt)} />
                        <DetailRow label="Updated At" value={formatDate(surrender.updatedAt)} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
