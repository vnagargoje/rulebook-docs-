import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextAreaField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import { type Plan } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const createSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    validityDays: z.coerce.number().min(1, 'Must be at least 1 day'),
    kmRange: z.coerce.number().min(0, 'Must be 0 or more'),
    price: z.coerce.number().min(0, 'Must be 0 or more'),
    deposit: z.coerce.number().min(0, 'Must be 0 or more'),
    status: z.enum(['ACTIVE', 'INACTIVE']),
})

export type CreateFormValues = z.infer<typeof createSchema>

export default function CreatePlanRoute() {
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(createSchema) as any,
        defaultValues: {
            name: '',
            description: '',
            validityDays: 30,
            kmRange: 1000,
            price: 5000,
            deposit: 2000,
            status: 'ACTIVE',
        },
    })

    const onSubmit = async (values: CreateFormValues) => {
        try {
            await mockApi.savePlan('plans', values as unknown as Plan)
            toast.success('Plan created successfully')
            navigate('/plans')
        } catch (error) {
            toast.error('Failed to create plan')
        }
    }

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
                                    <TextInputField control={form.control} name="kmRange" label="Distance Allowance (KM)" type="number" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Pricing & Financials</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="price" label="Base Price (₹)" type="number" />
                                    <TextInputField control={form.control} name="deposit" label="Security Deposit (₹)" type="number" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <SelectField
                                        control={form.control}
                                        name="status"
                                        label="Plan Availability"
                                        options={[{ label: 'Currently Active', value: 'ACTIVE' }, { label: 'Inactive / Hidden', value: 'INACTIVE' }]}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/plans')}>Cancel</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">
                                    Publish Plan
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
