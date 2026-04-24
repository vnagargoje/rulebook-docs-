import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { TextAreaField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { formatCurrency } from '~/lib/formatter'
import { useSurrenderDetails, useSurrenderVehicle } from '~/queries/surrender'
import { createSurrenderSchema, type CreateSurrenderValues } from '~/schemas'

export default function CreateSurrenderRoute() {
    const navigate = useNavigate()
    const surrenderVehicle = useSurrenderVehicle()

    const form = useForm({
        resolver: zodResolver(createSurrenderSchema),
        defaultValues: {
            vehicleNumber: '',
            penalty: 0,
            miscCharges: 0,
            refundAmount: 0,
            notes: '',
        },
    })

    const vehicleNumber = form.watch('vehicleNumber')?.trim()

    const detailsQuery = useSurrenderDetails(vehicleNumber, false)

    const fetchSurrenderDetails = useCallback(async () => {
        if (!vehicleNumber) {
            toast.error('Enter a vehicle number first')
            return
        }

        const result = await detailsQuery.refetch()

        if (result.error) {
            toast.error('Failed to fetch surrender details')
            return
        }

        if (result.data) {
            form.setValue('penalty', result.data.rtoPenalty ?? 0)
            form.setValue('refundAmount', result.data.refundAmount ?? 0)
            toast.success('Surrender details loaded')
        }
    }, [detailsQuery, form, vehicleNumber])

    const onSubmit = async (values: CreateSurrenderValues) => {
        try {
            if (!detailsQuery.data) {
                toast.error('Fetch surrender details before submitting')
                return
            }

            await surrenderVehicle.mutateAsync({
                vehicleNumber: values.vehicleNumber,
                data: {
                    penalty: values.penalty,
                    miscCharges: values.miscCharges,
                    refundAmount: values.refundAmount,
                    notes: values.notes?.trim() || null,
                },
            })
            toast.success('Vehicle surrender processed successfully')
            navigate('/surrender')
        } catch (_error) {
            toast.error('Failed to process surrender')
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/surrender')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Process Vehicle Return"
                    description="Handle vehicle surrenders, compute penalties and process deposit returns"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                                <TextInputField
                                    control={form.control}
                                    name="vehicleNumber"
                                    label="Vehicle Number"
                                    placeholder="Enter vehicle number"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={fetchSurrenderDetails}
                                    disabled={detailsQuery.isFetching}>
                                    {detailsQuery.isFetching ? 'Fetching...' : 'Fetch Details'}
                                </Button>
                            </div>

                            {detailsQuery.data ? (
                                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Surrender Details</div>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <div className="text-sm"><span className="text-muted-foreground">Customer ID:</span> {detailsQuery.data.customerId}</div>
                                        <div className="text-sm"><span className="text-muted-foreground">Customer Name:</span> {detailsQuery.data.customerName ?? '—'}</div>
                                        <div className="text-sm"><span className="text-muted-foreground">Deposit Amount:</span> {formatCurrency(detailsQuery.data.depositAmount)}</div>
                                        <div className="text-sm"><span className="text-muted-foreground">RTO Penalty:</span> {formatCurrency(detailsQuery.data.rtoPenalty)}</div>
                                        <div className="text-sm"><span className="text-muted-foreground">Suggested Refund:</span> {formatCurrency(detailsQuery.data.refundAmount)}</div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="grid grid-cols-2 gap-6">
                                <TextInputField control={form.control} name="penalty" label="Penalty (₹)" type="number" />
                                <TextInputField control={form.control} name="miscCharges" label="Misc Charges (₹)" type="number" />
                            </div>

                            <TextInputField control={form.control} name="refundAmount" label="Refund Amount (₹)" type="number" />

                            <TextAreaField control={form.control} name="notes" label="Notes" placeholder="Optional notes for surrender processing." />

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/surrender')}>Cancel Workflow</Button>
                                <Button
                                    type="submit"
                                    className="min-w-[140px] uppercase text-xs font-bold tracking-widest"
                                    disabled={surrenderVehicle.isPending || !detailsQuery.data}>
                                    {surrenderVehicle.isPending ? 'Processing...' : 'Process Surrender'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
