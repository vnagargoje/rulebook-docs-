import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextAreaField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useCreateTopUp } from '~/queries/top-ups'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const createSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    validityDays: z.coerce.number().min(1, 'Must be at least 1 day'),
    kmLimit: z.coerce.number().min(0, 'Must be 0 or more'),
    price: z.coerce.number().min(0, 'Must be 0 or more'),
    gst: z.coerce.number().min(0, 'Must be 0 or more'),
    active: z.enum(['true', 'false']),
})

export type CreateTopUpValues = z.infer<typeof createSchema>
type CreateTopUpInput = z.input<typeof createSchema>

export default function CreateTopUpPlanRoute() {
    const navigate = useNavigate()
    const createTopUp = useCreateTopUp()

    const form = useForm<CreateTopUpInput, unknown, CreateTopUpValues>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            name: '',
            description: '',
            validityDays: 1,
            kmLimit: 100,
            price: 500,
            gst: 0,
            active: 'true',
        },
    })

    const onSubmit = useCallback((values: CreateTopUpValues) => {
        createTopUp.mutate({
            name: values.name,
            description: values.description,
            validityDays: values.validityDays,
            kmLimit: values.kmLimit,
            price: values.price,
            gst: values.gst,
            active: values.active === 'true',
        }, {
            onSuccess: () => {
                toast.success('New Top-Up plan published')
                navigate('/top-up-plans')
            },
            onError: () => {
                toast.error('Could not save Top-Up plan')
            },
        })
    }, [createTopUp, navigate])

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/top-up-plans')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Create New Top-Up Plan"
                    description="Offer an additional mileage or duration addon for current subscribers"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Booster Package Detail</h4>
                                <TextInputField control={form.control} name="name" label="Top-Up Identifier" placeholder="e.g. Extra 100km Booster" />
                                <TextAreaField control={form.control} name="description" label="Marketing Description" placeholder="Highlight why customers should buy this..." />
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Allowances & Logic</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="validityDays" label="Validity Extension (Days)" type="number" />
                                    <TextInputField control={form.control} name="kmLimit" label="Distance Add-on (KM)" type="number" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Financial Configuration</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="price" label="Purchase Price (₹)" type="number" />
                                    <TextInputField control={form.control} name="gst" label="GST (₹)" type="number" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <SelectField
                                        control={form.control}
                                        name="active"
                                        label="Visibility Status"
                                        options={[{ label: 'Active & Available', value: 'true' }, { label: 'Inactive / Archived', value: 'false' }]}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/top-up-plans')}>Cancel</Button>
                                <Button type="submit" disabled={createTopUp.isPending} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {createTopUp.isPending ? 'Creating...' : 'Publish Booster'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
