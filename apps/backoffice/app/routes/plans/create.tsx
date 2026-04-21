import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextAreaField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useCreatePlan } from '~/queries/plans'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { createPlanSchema, type CreatePlanFormValues, type CreatePlanFormInput } from '~/schemas'

export default function CreatePlanRoute() {
    const navigate = useNavigate()
    const createPlan = useCreatePlan()

    const form = useForm<CreatePlanFormInput, unknown, CreatePlanFormValues>({
        resolver: zodResolver(createPlanSchema),
        defaultValues: {
            name: '',
            description: '',
            validityDays: 30,
            kmLimit: 1000,
            price: 5000,
            deposit: 2000,
            gst: 0,
            registrationFee: 0,
            active: 'true',
        },
    })

    const onSubmit = useCallback((values: CreatePlanFormValues) => {
        createPlan.mutate({
            name: values.name,
            description: values.description,
            validityDays: values.validityDays,
            kmLimit: values.kmLimit,
            price: values.price,
            deposit: values.deposit,
            gst: values.gst,
            registrationFee: values.registrationFee,
            active: values.active === 'true',
        }, {
            onSuccess: () => {
                toast.success('Plan created successfully')
                navigate('/plans')
            },
            onError: () => {
                toast.error('Failed to create plan')
            },
        })
    }, [createPlan, navigate])

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/plans')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Define New Subscription"
                    description="Create a new core subscription offering for customers"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Core Offering</h4>
                                <div className="space-y-6">
                                    <TextInputField control={form.control} name="name" label="Plan Name" placeholder="e.g. Premium Rider Monthly" />
                                    <TextAreaField control={form.control} name="description" label="Marketing Description" placeholder="Detailed explanation of the plan's benefits..." />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Limits & Validity</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="validityDays" label="Validity Duration (Days)" type="number" />
                                    <TextInputField control={form.control} name="kmLimit" label="Distance Allowance (KM)" type="number" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Pricing & Financials</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="price" label="Base Price (₹)" type="number" />
                                    <TextInputField control={form.control} name="deposit" label="Security Deposit (₹)" type="number" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="gst" label="GST (₹)" type="number" />
                                    <TextInputField control={form.control} name="registrationFee" label="Registration Fee (₹)" type="number" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <SelectField
                                        control={form.control}
                                        name="active"
                                        label="Plan Availability"
                                        options={[{ label: 'Currently Active', value: 'true' }, { label: 'Inactive / Hidden', value: 'false' }]}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/plans')}>Cancel</Button>
                                <Button type="submit" disabled={createPlan.isPending} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {createPlan.isPending ? 'Creating...' : 'Publish Plan'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
