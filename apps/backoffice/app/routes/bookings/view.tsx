import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { TextInputField } from '~/components/forms/controlled-fields'
import { PageHeader } from '~/components/ui/page-header'
import { StatusBadge } from '~/components/ui/status-badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Form } from '~/components/ui/form'
import { useGetBookingById, useAssignVehicle } from '~/queries/bookings'
import { formatDate } from '~/lib/formatter'
import { assignVehicleSchema, type AssignVehicleValues } from '~/schemas'

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between py-3 border-b border-border/40 last:border-0">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="text-sm font-semibold text-right max-w-[60%] break-all">{value ?? '—'}</span>
        </div>
    )
}

export default function BookingViewRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: booking, isLoading } = useGetBookingById(id)
    const assignVehicle = useAssignVehicle()

    const form = useForm<AssignVehicleValues>({
        resolver: zodResolver(assignVehicleSchema),
        defaultValues: { vehicleId: '', batteryId: '' },
    })

    const onAssignVehicle = useCallback((values: AssignVehicleValues) => {
        if (!id) {
            return
        }

        assignVehicle.mutate({
            id,
            data: { vehicleId: values.vehicleId, batteryId: values.batteryId },
        }, {
            onSuccess: () => {
                toast.success('Vehicle assigned successfully')
                form.reset()
            },
            onError: () => {
                toast.error('Failed to assign vehicle')
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

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/bookings')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Booking Details"
                    description={`Booking ${booking.id}`}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-2">Booking Information</h4>
                        <DetailRow label="Booking ID" value={booking.id} />
                        <DetailRow label="Status" value={<StatusBadge status={booking.status.toUpperCase()} />} />
                        <DetailRow label="Pickup OTP" value={<span className="font-mono text-base font-bold tracking-widest">{booking.pickupOtp}</span>} />
                        <DetailRow label="Created" value={formatDate(booking.createdAt)} />
                        <DetailRow label="Updated" value={formatDate(booking.updatedAt)} />
                    </CardContent>
                </Card>

                <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-2">References</h4>
                        <DetailRow label="User ID" value={booking.userId} />
                        <DetailRow label="User Plan ID" value={booking.userPlanId} />
                        <DetailRow label="Station ID" value={booking.stationId} />
                        <DetailRow label="Vehicle ID" value={booking.vehicleId} />
                        <DetailRow label="Battery ID" value={booking.batteryId} />
                    </CardContent>
                </Card>

                <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-2">Timeline</h4>
                        <DetailRow label="Started At" value={booking.startedAt ? formatDate(booking.startedAt) : '—'} />
                        <DetailRow label="Completed At" value={booking.completedAt ? formatDate(booking.completedAt) : '—'} />
                        <DetailRow label="Cancelled At" value={booking.cancelledAt ? formatDate(booking.cancelledAt) : '—'} />
                        <DetailRow label="Cancellation Reason" value={booking.cancellationReason} />
                    </CardContent>
                </Card>

                {canAssignVehicle && (
                    <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                        <CardContent className="p-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-4">Assign Vehicle</h4>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onAssignVehicle)} className="space-y-4">
                                    <TextInputField control={form.control} name="vehicleId" label="Vehicle ID" placeholder="Enter vehicle ID" />
                                    <TextInputField control={form.control} name="batteryId" label="Battery ID" placeholder="Enter battery ID" />
                                    <Button type="submit" disabled={assignVehicle.isPending} className="w-full uppercase text-xs font-bold tracking-widest">
                                        {assignVehicle.isPending ? 'Assigning...' : 'Assign Vehicle & Battery'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
