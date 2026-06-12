import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft, IconBolt, IconCalendarEvent, IconMapPin, IconMotorbike, IconPhone, IconQrcode, IconReceiptRupee, IconShieldCheck, IconUser, IconMail } from '@tabler/icons-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { SearchableSelectField, TextInputField } from '~/components/forms/controlled-fields'
import { PageHeader } from '~/components/ui/page-header'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Form } from '~/components/ui/form'
import { DetailRow } from '~/components/ui/detail-row'
import { StatTile } from '~/components/ui/stat-tile'
import { SectionLabel } from '~/components/ui/section-label'
import { MetaPill } from '~/components/ui/meta-pill'
import { useGetBookingById, useAssignVehicle } from '~/queries/bookings'
import { useInfiniteVehicles } from '~/queries/vehicles'
import { useInfiniteBatteries } from '~/queries/batteries'
// import { useInfiniteUserPlans } from '~/queries/user-plans'
import { formatCurrency, formatDate, formatKm } from '~/lib/formatter'
import { assignVehicleSchema, type AssignVehicleValues } from '~/schemas'

function getAssetUrl(path?: string | null) {
    if (!path) {
        return null
    }

    if (/^https?:\/\//.test(path)) {
        return path
    }

    const apiUrl = (import.meta.env.VITE_API_URL as string) || 'https://api.evyugo.com'
    const normalizedBase = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${normalizedBase}${normalizedPath}`
}

export default function BookingViewRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: booking, isLoading } = useGetBookingById(id)
    const { data: vehiclesData, isFetching: vehiclesLoading, fetchNextPage: fetchNextVehiclePage, hasNextPage: hasNextVehiclePage } = useInfiniteVehicles({
        sortBy: ['createdAt:DESC'],
        'filter.status': ['$eq:available'],
        'filter.station.type': ['$eq:vehicle_station'],
    } as any)
    const { data: batteriesData, isFetching: batteriesLoading, fetchNextPage: fetchNextBatteryPage, hasNextPage: hasNextBatteryPage } = useInfiniteBatteries({
        sortBy: ['createdAt:DESC'],
        'filter.status': ['$eq:available'],
        'filter.station.type': ['$eq:vehicle_station'],
    })
    // TODO: Re-enable Future Plan feature when required
    /*
    const { data: userPlansData } = useInfiniteUserPlans(
        booking?.userPlan?.userId ? ({
            'filter.userId': [`$eq:${booking.userPlan.userId}`],
            'filter.status': ['$eq:purchased'],
        } as any) : undefined
    )
    const futurePlan = userPlansData?.pages[0]?.data?.find((plan: any) => plan.id !== booking?.userPlan?.id)
    */
    const assignVehicle = useAssignVehicle()

    const form = useForm<AssignVehicleValues>({
        resolver: zodResolver(assignVehicleSchema),
        defaultValues: { vehicleId: '', batteryId: '', otp: '' },
    })

    const vehicleOptions = useMemo(() => (vehiclesData?.pages ?? []).flatMap((p) => p.data).map((vehicle) => ({
        value: vehicle.id,
        label: `${vehicle.vehicleNumber ?? 'Unnamed Vehicle'}${vehicle.station?.name ? ` • ${vehicle.station.name}` : ''}`,
    })), [vehiclesData?.pages])

    const batteryOptions = useMemo(() => (batteriesData?.pages ?? []).flatMap((p) => p.data).map((battery) => ({
        value: battery.id,
        label: `${battery.batteryQrId ?? 'Unnamed Battery'}${battery.station?.name ? ` • ${battery.station.name}` : ''}`,
    })), [batteriesData?.pages])

    const onAssignVehicle = useCallback((values: AssignVehicleValues) => {
        if (!id) {
            return
        }

        assignVehicle.mutate({
            id,
            data: {
                vehicleId: values.vehicleId,
                batteryId: values.batteryId,
                otp: values.otp,
            },
        }, {
            onSuccess: () => {
                toast.success('Vehicle assigned successfully')
                form.reset()
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message
                toast.error(Array.isArray(message) ? message.join(', ') : (message || 'Failed to assign vehicle'))
            },
        })
    }, [assignVehicle, form, id])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Booking...</div>
    }

    if (!booking) {
        return <div className="p-8 text-center text-muted-foreground">Booking not found</div>
    }

    const canAssignVehicle = booking.status === 'created'
    const customer = (booking.userPlan as any).user as { id?: string; firstName?: string; lastName?: string; email?: string; mobilenumber?: string } | undefined
    const customerName = [customer?.firstName, customer?.lastName].filter(Boolean).join(' ')
    const planSnapshot = booking.userPlan?.planSnapshot ?? {}
    const plan = booking.userPlan?.plan
    const planName = plan?.name ?? planSnapshot.name ?? 'Customer plan'
    const planDescription = planSnapshot.description
    const qrCodeUrl = getAssetUrl(booking.userPlan?.qrCode?.path)
    const remainingKm = Number(booking.userPlan?.remainingKm ?? planSnapshot.kmLimit ?? 0)
    const validityDays = Number(plan?.validityDays ?? planSnapshot.validityDays ?? 0)
    const topUps = booking.userPlan?.topUps ?? []
    const appliedTopUps = topUps.filter((t) => t.status === 'applied')
    const totalTopUpKm = appliedTopUps.reduce((sum, topUp) => sum + Number(topUp.topUpSnapshot?.kmLimit ?? 0), 0)
    const kmLimit = Number(booking.userPlan?.totalKm ?? 0)

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Booking Details"
                    description={`Booking ${booking.id}`}
                />
            </div>

            <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-primary/[0.06] via-white to-white shadow-sm">
                <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.9fr)] lg:items-start">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={booking.status.toUpperCase()} />
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                                {planName}
                            </span>
                            <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {booking.userPlan.status}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-semibold tracking-tight text-foreground">{planName}</h2>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                                {planDescription || 'Admin overview of booking progress, assigned resources, active plan details, QR code, and recharge history.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <MetaPill icon={IconCalendarEvent}>Created {formatDate(booking.createdAt)}</MetaPill>
                            <MetaPill icon={IconMapPin}>{booking.station?.name ?? 'Station pending'}</MetaPill>
                            <MetaPill icon={IconMotorbike}>{booking.vehicle?.vehicleNumber ?? 'Vehicle pending'}</MetaPill>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                        <StatTile label="Remaining KM" value={formatKm(remainingKm)} icon={IconBolt} />
                        <StatTile label="KM Limit" value={formatKm(kmLimit)} icon={IconShieldCheck} />
                        <StatTile label="Validity" value={`${validityDays} days`} icon={IconCalendarEvent} />
                        <StatTile label="Top-Ups" value={appliedTopUps.length > 0 ? `${appliedTopUps.length} applied` : 'None'} icon={IconReceiptRupee} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
                <Card className="flex h-full flex-col overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <IconUser size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Customer</CardTitle>
                                <CardDescription>Account details of the customer who purchased this plan.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold uppercase">
                                {customerName ? customerName[0] : (customer?.email?.[0] ?? customer?.mobilenumber?.[0] ?? '?')}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-lg font-bold text-foreground truncate">
                                    {customerName || customer?.mobilenumber || customer?.email || 'N/A'}
                                </p>
                                {(customer?.mobilenumber || customer?.email) && (
                                    <div className="mt-1.5 flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                                        {customer?.mobilenumber && (
                                            <span className="flex items-center gap-1.5">
                                                <IconPhone size={16} />
                                                {customer.mobilenumber}
                                            </span>
                                        )}
                                        {customer?.email && (
                                            <span className="flex items-center gap-1.5 truncate">
                                                <IconMail size={16} />
                                                {customer.email}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl border border-border/60 bg-muted/30 p-5">
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Contact Information</h3>
                            <div className="grid gap-3 flex-1">
                                <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-white p-3.5 shadow-sm">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <IconPhone size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-muted-foreground">Mobile</p>
                                        <p className="truncate text-sm font-bold text-foreground mt-0.5">{customer?.mobilenumber || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-white p-3.5 shadow-sm">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <IconMail size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-muted-foreground">Email</p>
                                        <p className="truncate text-sm font-bold text-foreground mt-0.5">{customer?.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {canAssignVehicle && (
                    <Card className="flex h-full flex-col overflow-hidden border-border/40 bg-white shadow-sm">
                        <CardHeader className="border-b border-border/40">
                            <CardTitle>Assign Vehicle</CardTitle>
                            <CardDescription>
                                Select an available vehicle and battery, then enter the 4-digit pickup OTP shared by the customer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col space-y-5 p-6">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <StatTile label="Vehicles" value={vehiclesData?.pages[0]?.meta.totalItems ?? vehicleOptions.length} icon={IconMotorbike} />
                                <StatTile label="Batteries" value={batteriesData?.pages[0]?.meta.totalItems ?? batteryOptions.length} icon={IconBolt} />
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onAssignVehicle)} className="flex flex-1 flex-col space-y-4">
                                    <SearchableSelectField
                                        control={form.control}
                                        name="vehicleId"
                                        label="Vehicle"
                                        placeholder={vehiclesLoading ? 'Loading vehicles...' : 'Select vehicle'}
                                        options={vehicleOptions}
                                        disabled={vehicleOptions.length === 0}
                                        isLoading={vehiclesLoading}
                                        onLoadMore={fetchNextVehiclePage}
                                        hasNextPage={hasNextVehiclePage}
                                    />
                                    <SearchableSelectField
                                        control={form.control}
                                        name="batteryId"
                                        label="Battery"
                                        placeholder={batteriesLoading ? 'Loading batteries...' : 'Select battery'}
                                        options={batteryOptions}
                                        disabled={batteryOptions.length === 0}
                                        isLoading={batteriesLoading}
                                        onLoadMore={fetchNextBatteryPage}
                                        hasNextPage={hasNextBatteryPage}
                                    />
                                    <TextInputField
                                        control={form.control}
                                        name="otp"
                                        label="Customer Pickup OTP"
                                        placeholder="Enter 4-digit OTP"
                                        onlyDigits={true}
                                        maxLength={4}
                                    />
                                    <div className="flex-1" />
                                    <Button
                                        type="submit"
                                        disabled={assignVehicle.isPending || vehicleOptions.length === 0 || batteryOptions.length === 0}
                                        className="mt-auto w-full uppercase text-xs font-bold tracking-widest">
                                        {assignVehicle.isPending ? 'Assigning...' : 'Assign Vehicle & Battery'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                )}

                {!canAssignVehicle && (
                    <Card className="flex h-full flex-col overflow-hidden border-border/40 bg-white shadow-sm">
                        <CardHeader className="border-b border-border/40">
                            <CardTitle>Assignment Snapshot</CardTitle>
                            <CardDescription>Vehicle assignment is locked once the booking moves beyond the created state.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col p-6">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <StatTile label="Vehicle" value={booking.vehicle?.vehicleNumber ?? 'Unassigned'} icon={IconMotorbike} />
                                <StatTile label="Battery" value={booking.battery?.batteryQrId ?? 'Unassigned'} icon={IconBolt} />
                            </div>
                            <div className="mt-auto pt-4">
                                <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 text-sm text-muted-foreground">
                                    Current status: <span className="font-semibold text-foreground">{booking.status}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_380px]">
                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Booking Overview</CardTitle>
                        <CardDescription>Operational and reference data for this booking in a single place.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 p-6 lg:grid-cols-2">
                        <div>
                            <SectionLabel>Booking information</SectionLabel>
                            <DetailRow label="Booking ID" value={booking.id} />
                            <DetailRow label="Status" value={<StatusBadge status={booking.status.toUpperCase()} />} />
                            <DetailRow label="Pickup OTP" value={booking.pickupOtp ? <span className="font-mono text-base font-bold tracking-widest">{booking.pickupOtp}</span> : 'Hidden for admin'} />
                            <DetailRow label="Created" value={formatDate(booking.createdAt)} />
                            {/* <DetailRow label="Started At" value={booking.startedAt ? formatDate(booking.startedAt) : 'N/A'} />
                            <DetailRow label="Completed At" value={booking.completedAt ? formatDate(booking.completedAt) : 'N/A'} /> */}
                            <DetailRow label="Updated" value={formatDate(booking.updatedAt)} />
                        </div>

                        <div>
                            <SectionLabel>Assigned resources</SectionLabel>
                            <DetailRow label="Station" value={booking.station?.name ?? booking.stationId ?? 'N/A'} />
                            <DetailRow label="Vehicle" value={booking.vehicle?.vehicleNumber ?? booking.vehicleId ?? 'Unassigned'} />
                            <DetailRow label="Battery" value={booking.battery?.batteryQrId ?? booking.batteryId ?? 'Unassigned'} />
                            {/* <DetailRow label="User ID" value={booking.userId ?? 'N/A'} /> */}
                            <DetailRow label="User Plan ID" value={booking.userPlanId} />
                            {/* <DetailRow label="Cancellation Reason" value={booking.cancellationReason ?? 'N/A'} /> */}
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <IconQrcode size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Plan QR</CardTitle>
                                <CardDescription>Scan-ready code linked to the customer's active plan.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5 p-6">
                        <div className="overflow-hidden rounded-3xl border border-dashed border-border bg-gradient-to-br from-muted/40 to-white p-5">
                            {qrCodeUrl ? (
                                <img
                                    src={qrCodeUrl}
                                    alt={`QR code for ${planName}`}
                                    className="mx-auto aspect-square w-full max-w-[240px] rounded-2xl border border-border bg-white object-contain p-3"
                                />
                            ) : (
                                <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-border bg-white text-sm text-muted-foreground">
                                    QR code not available
                                </div>
                            )}
                        </div>
                        {qrCodeUrl ? (
                            <a
                                href={qrCodeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/40">
                                Open QR in new tab
                            </a>
                        ) : null}
                        <div className="rounded-2xl border border-border/50 bg-muted/20 p-4">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">QR reference</div>
                            <div className="mt-2 break-all text-sm font-medium text-foreground">{booking.userPlan?.qrCode?.id ?? 'N/A'}</div>
                            {booking.userPlan?.qrCode?.path ? (
                                <div className="mt-2 break-all text-xs text-muted-foreground">{booking.userPlan.qrCode.path}</div>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>User Plan Details</CardTitle>
                        <CardDescription>Expanded active plan data loaded from the booking relation for admin review.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                        <div>
                            <SectionLabel>Plan summary</SectionLabel>
                            <DetailRow label="Plan name" value={planName} />
                            <DetailRow label="Plan ID" value={booking.userPlan.plan?.id ?? 'N/A'} />
                            <DetailRow label="User Plan status" value={<StatusBadge status={booking.userPlan.status.toUpperCase()} />} />
                            <DetailRow label="Remaining KM" value={formatKm(remainingKm)} />
                            <DetailRow label="Starts At" value={booking.userPlan.startsAt ? formatDate(booking.userPlan.startsAt) : 'N/A'} />
                            <DetailRow label="Expires At" value={booking.userPlan.expiresAt ? formatDate(booking.userPlan.expiresAt) : 'N/A'} />
                        </div>
                        <div>
                            <SectionLabel>Commercials</SectionLabel>
                            <DetailRow label="Price" value={formatCurrency(planSnapshot.price ?? plan?.price)} />
                            <DetailRow label="Deposit" value={formatCurrency(planSnapshot.deposit ?? plan?.deposit)} />
                            <DetailRow label="GST" value={`${planSnapshot.gstPercentage ?? (plan as any)?.gstPercentage ?? 0}%`} />
                            <DetailRow label="Registration" value={formatCurrency(planSnapshot.registrationFee)} />
                            <DetailRow label="Total amount" value={formatCurrency(planSnapshot.totalAmount ?? plan?.totalAmount)} />
                            <DetailRow label="KM limit" value={formatKm(kmLimit)} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Plan Snapshot</CardTitle>
                        <CardDescription>Immutable plan data captured when the user purchased this plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <div className="grid grid-cols-2 gap-3">
                            <StatTile label="Plan value" value={formatCurrency(planSnapshot.totalAmount ?? plan?.totalAmount)} icon={IconReceiptRupee} />
                            <StatTile label="Purchased KM" value={formatKm(planSnapshot.kmLimit)} icon={IconBolt} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TODO: Re-enable Future Plan feature when required
            {futurePlan && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                    <Card className="overflow-hidden border-amber-500/20 bg-amber-50/10 shadow-sm">
                        <CardHeader className="border-b border-border/40">
                            <CardTitle className="text-amber-700">Future Plan Details</CardTitle>
                            <CardDescription>Upcoming plan that will activate when the current one expires.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                            <div>
                                <SectionLabel>Plan summary</SectionLabel>
                                <DetailRow label="Plan name" value={(futurePlan as any).plan?.name ?? (futurePlan.planSnapshot as any)?.name ?? 'N/A'} />
                                <DetailRow label="Plan ID" value={futurePlan.planId ?? 'N/A'} />
                                <DetailRow label="User Plan status" value={<StatusBadge status={futurePlan.status.toUpperCase()} />} />
                                <DetailRow label="Purchased At" value={formatDate(futurePlan.createdAt)} />
                            </div>
                            <div>
                                <SectionLabel>Commercials</SectionLabel>
                                <DetailRow label="Price" value={formatCurrency((futurePlan.planSnapshot as any)?.price ?? (futurePlan as any).plan?.price)} />
                                <DetailRow label="Deposit" value={formatCurrency((futurePlan.planSnapshot as any)?.deposit ?? (futurePlan as any).plan?.deposit)} />
                                <DetailRow label="Total amount" value={formatCurrency((futurePlan.planSnapshot as any)?.totalAmount ?? (futurePlan as any).plan?.totalAmount)} />
                                <DetailRow label="KM limit" value={formatKm((futurePlan.planSnapshot as any)?.kmLimit ?? (futurePlan as any).plan?.kmLimit)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-amber-500/20 bg-amber-50/10 shadow-sm">
                        <CardHeader className="border-b border-border/40">
                            <CardTitle className="text-amber-700">Future Snapshot</CardTitle>
                            <CardDescription>Immutable data captured when the user purchased this future plan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="grid grid-cols-2 gap-3">
                                <StatTile label="Plan value" value={formatCurrency((futurePlan.planSnapshot as any)?.totalAmount ?? (futurePlan as any).plan?.totalAmount)} icon={IconReceiptRupee} />
                                <StatTile label="Purchased KM" value={formatKm((futurePlan.planSnapshot as any)?.kmLimit ?? (futurePlan as any).plan?.kmLimit)} icon={IconBolt} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            */}

            <div className="grid grid-cols-1 gap-6">
                <Card className="overflow-hidden border-border/40 bg-white shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle>Top-Up History</CardTitle>
                        <CardDescription>All recharges linked to this plan, including pending and failed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 p-6">
                        {appliedTopUps.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-3">
                                <StatTile label="Applied" value={appliedTopUps.length} icon={IconReceiptRupee} />
                                <StatTile label="Added KM" value={formatKm(totalTopUpKm)} icon={IconBolt} />
                                <StatTile label="Last Applied" value={formatDate(appliedTopUps[0].appliedAt ?? '')} icon={IconCalendarEvent} />
                            </div>
                        ) : null}
                        {topUps.length > 0 ? topUps.map((topUp) => {
                            const snapshot = topUp.topUpSnapshot ?? {}
                            const extraKm = Number(snapshot.extraKm ?? snapshot.kmLimit ?? 0)
                            const extraDays = Number(snapshot.extraDays ?? snapshot.validityDays ?? 0)
                            const statusStyles = {
                                applied: { card: 'border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white', badge: 'bg-emerald-50 text-emerald-700', km: 'bg-emerald-50 text-emerald-700' },
                                awaiting: { card: 'border-amber-100 bg-gradient-to-br from-amber-50/40 to-white', badge: 'bg-amber-50 text-amber-700', km: 'bg-muted text-muted-foreground' },
                                failed: { card: 'border-red-100 bg-gradient-to-br from-red-50/40 to-white', badge: 'bg-red-50 text-red-700', km: 'bg-muted text-muted-foreground' },
                            }[topUp.status] ?? { card: 'border-border/50 bg-gradient-to-br from-muted/20 to-white', badge: 'bg-muted text-muted-foreground', km: 'bg-muted text-muted-foreground' }
                            return (
                                <div key={topUp.id} className={`rounded-2xl border p-4 ${statusStyles.card}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">{snapshot.name ?? 'Top-up'}</div>
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                {topUp.status === 'applied'
                                                    ? `Applied ${topUp.appliedAt ? formatDate(topUp.appliedAt) : ''}`
                                                    : topUp.status === 'awaiting'
                                                        ? 'Awaiting payment confirmation'
                                                        : 'Payment failed'}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${statusStyles.badge}`}>{topUp.status}</span>
                                            {topUp.status === 'applied' && (
                                                <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles.km}`}>
                                                    +{formatKm(extraKm)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        <span className="rounded-full bg-white px-3 py-1">{formatCurrency(snapshot.price)}</span>
                                        {extraDays ? <span className="rounded-full bg-white px-3 py-1">+{extraDays} days</span> : null}
                                        <span className="rounded-full bg-white px-3 py-1">{topUp.topUpId}</span>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
                                No top-ups have been added to this plan yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
