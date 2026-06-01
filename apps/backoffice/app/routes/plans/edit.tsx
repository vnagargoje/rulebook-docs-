import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextAreaField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useGetPlanById, useUpdatePlan } from '~/queries/plans'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { updatePlanSchema, type UpdatePlanFormValues, type UpdatePlanFormInput } from '~/schemas'

export default function EditPlanRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: plan, isLoading } = useGetPlanById(id)
    const updatePlan = useUpdatePlan()

    const form = useForm<UpdatePlanFormInput, unknown, UpdatePlanFormValues>({
        resolver: zodResolver(updatePlanSchema),
        mode: 'onChange',
    })

    useEffect(() => {
        if (plan) {
            form.reset({
                name: plan.name,
                description: plan.description ?? '',
                validityDays: plan.validityDays,
                kmLimit: plan.kmLimit,
                price: plan.price,
                deposit: plan.deposit,
                gstPercentage: plan.gstPercentage,
                registrationFee: plan.registrationFee ?? 499,
                active: plan.active ? 'true' : 'false',
            })
        }
    }, [plan, form])

    const onSubmit = useCallback((values: UpdatePlanFormValues) => {
        if (!id) return

        updatePlan.mutate({
            id,
            data: {
                name: values.name,
                description: values.description,
                validityDays: values.validityDays,
                kmLimit: values.kmLimit,
                price: values.price,
                deposit: values.deposit,
                gstPercentage: values.gstPercentage,
               
                active: values.active === 'true',
            },
        }, {
            onSuccess: () => {
                toast.success('Plan updated successfully')
                navigate('/plans')
            },
            onError: () => {
                toast.error('Failed to update plan')
            },
        })
    }, [id, updatePlan, navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Modify Subscription Plan"
                    description="Update the pricing, validity, or deposit requirements"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Core Offering</h4>
                                <div className="space-y-6">
                                    <TextInputField control={form.control} name="name" label="Plan Name" placeholder="e.g. Premium Rider Monthly" required />
                                    <TextAreaField control={form.control} name="description" label="Marketing Description" placeholder="Detailed explanation of the plan's benefits..." />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Limits & Validity</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="validityDays" label="Validity Duration (Days)" type="number" required />
                                    <TextInputField control={form.control} name="kmLimit" label="Distance Allowance (KM)" type="number" required />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Pricing & Financials</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="price" label="Base Price (₹)" type="number" required />
                                    <TextInputField control={form.control} name="deposit" label="Security Deposit (₹)" type="number" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="gstPercentage" label="GST (%)" type="number" maxLength={2} onlyDigits />
                                    <TextInputField control={form.control} name="registrationFee" label="Registration Fee (₹)" type="number" disabled />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <SelectField
                                        control={form.control}
                                        name="active"
                                        label="Plan Availability"
                                        options={[{ label: 'Active', value: 'true' }, { label: 'Inactive', value: 'false' }]}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/plans')}>Cancel</Button>
                                <Button type="submit" disabled={updatePlan.isPending || !form.formState.isDirty} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {updatePlan.isPending ? 'Updating...' : 'Apply Update'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
