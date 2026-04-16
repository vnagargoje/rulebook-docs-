import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextAreaField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import { type Plan } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const updateSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    validityDays: z.coerce.number().min(1, 'Must be at least 1 day'),
    kmRange: z.coerce.number().min(0, 'Must be 0 or more'),
    price: z.coerce.number().min(0, 'Must be 0 or more'),
    deposit: z.coerce.number().min(0, 'Must be 0 or more'),
    status: z.enum(['ACTIVE', 'INACTIVE']),
})

export type UpdateTopUpValues = z.infer<typeof updateSchema>

export default function EditTopUpPlanRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    const form = useForm({
        resolver: zodResolver(updateSchema) as any,
    })

    useEffect(() => {
        const load = async () => {
            try {
                const plans = await mockApi.listPlans('topUpPlans')
                const found = plans.find(p => p.id === id)
                if (!found) {
                    toast.error('Top-Up Plan not found')
                    navigate('/top-up-plans')
                    return
                }
                form.reset(found)
            } catch (error) {
                toast.error('Failed to load plan data')
            } finally {
                setIsLoading(false)
            }
        }
        void load()
    }, [id, navigate, form])

    const onSubmit = async (values: UpdateTopUpValues) => {
        try {
            await mockApi.savePlan('topUpPlans', values as Plan)
            toast.success('Top-Up updated successfully')
            navigate('/top-up-plans')
        } catch (error) {
            toast.error('Could not save Top-Up plan')
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/top-up-plans')} className="shrink-0">
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
                                <TextInputField control={form.control} name="name" label="Top-Up Identifier" placeholder="e.g. Extra 100km Booster" />
                                <TextAreaField control={form.control} name="description" label="Marketing Description" placeholder="Highlight why customers should buy this..." />
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Allowances & Logic</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="validityDays" label="Validity Extension (Days)" type="number" />
                                    <TextInputField control={form.control} name="kmRange" label="Distance Add-on (KM)" type="number" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Financial Configuration</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="price" label="Purchase Price (₹)" type="number" />
                                    <SelectField
                                        control={form.control}
                                        name="status"
                                        label="Visibility Status"
                                        options={[{ label: 'Active & Available', value: 'ACTIVE' }, { label: 'Inactive / Archived', value: 'INACTIVE' }]}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/top-up-plans')}>Cancel</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">
                                    Commit Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
