import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextAreaField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useGetTopUpById, useUpdateTopUp } from '~/queries/top-ups'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { updateTopUpPlanSchema, type UpdateTopUpPlanFormValues, type UpdateTopUpPlanFormInput } from '~/schemas'
import { formatDate } from '~/lib/formatter'
import { DetailRow } from '~/components/ui/detail-row'

export default function EditTopUpPlanRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: topUp, isLoading } = useGetTopUpById(id)
    const updateTopUp = useUpdateTopUp()

    const form = useForm<UpdateTopUpPlanFormInput, unknown, UpdateTopUpPlanFormValues>({
        resolver: zodResolver(updateTopUpPlanSchema),
        mode: 'onChange',
    })

    useEffect(() => {
        if (topUp) {
            form.reset({
                name: topUp.name,
                description: topUp.description ?? '',
                kmLimit: topUp.kmLimit,
                price: topUp.price,
                gstPercentage: topUp.gstPercentage,
                active: topUp.active ? 'true' : 'false',
            })
        }
    }, [topUp, form])

    const onSubmit = useCallback((values: UpdateTopUpPlanFormValues) => {
        if (!id) return

        updateTopUp.mutate({
            id,
            data: {
                name: values.name,
                description: values.description,
                kmLimit: values.kmLimit,
                price: values.price,
                gstPercentage: values.gstPercentage,
                active: values.active === 'true',
            },
        }, {
            onSuccess: () => {
                toast.success('Top-Up updated successfully')
                navigate('/top-up-plans')
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Could not save Top-Up plan')
            },
        })
    }, [id, updateTopUp, navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
    }

    const createdAt = (topUp as any)?.createdAt as string | undefined
    const updatedAt = (topUp as any)?.updatedAt as string | undefined
    const isUpdated = createdAt && updatedAt && createdAt !== updatedAt

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Edit Performance Top-Up"
                    description="Update additional usage package configuration"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Booster Package Detail</h4>
                                <TextInputField control={form.control} name="name" label="Top-Up Identifier" placeholder="e.g. Extra 100km Booster" required />
                                <TextAreaField control={form.control} name="description" label="Marketing Description" placeholder="Highlight why customers should buy this..." />
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Allowances & Logic</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="kmLimit" label="Distance Add-on (KM)" type="number" required />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Financial Configuration</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="price" label="Purchase Price (₹)" type="number" required />
                                    <TextInputField control={form.control} name="gstPercentage" label="GST (%)" type="number" maxLength={2} onlyDigits />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <SelectField
                                        control={form.control}
                                        name="active"
                                        label="Visibility Status"
                                        options={[{ label: 'Active', value: 'true' }, { label: 'Inactive', value: 'false' }]}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/top-up-plans')}>Cancel</Button>
                                <Button type="submit" disabled={updateTopUp.isPending || !form.formState.isDirty} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {updateTopUp.isPending ? 'Updating...' : 'Commit Changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden mt-6">
                <CardHeader className="border-b border-border/40">
                    <CardTitle>Audit Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-x-6 gap-y-3 md:grid-cols-2">
                        <DetailRow label="Created At" value={createdAt ? formatDate(createdAt) : 'N/A'} />
                        <DetailRow label="Updated At" value={isUpdated ? formatDate(updatedAt) : 'N/A'} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
