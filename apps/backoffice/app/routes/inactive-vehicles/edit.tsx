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
import { inactiveVehicleStatusOptions, type InactiveVehicleRecord, type Vehicle } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const updateSchema = z.object({
    id: z.string(),
    reportedDate: z.string().min(1, 'Reported date is required'),
    vehicleId: z.string().min(1, 'Vehicle is required'),
    description: z.string().min(1, 'Description is required'),
    status: z.enum(['REPORTED', 'UNDER_REVIEW', 'RESOLVED']),
})

export type UpdateInactiveValues = z.infer<typeof updateSchema>

export default function EditInactiveRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const form = useForm({
        resolver: zodResolver(updateSchema) as any,
    })

    useEffect(() => {
        const load = async () => {
            try {
                const [records, fleet] = await Promise.all([
                    mockApi.listInactiveVehicles(),
                    mockApi.listVehicles()
                ])
                setVehicles(fleet)
                const found = records.find(r => r.id === id)
                if (!found) {
                    toast.error('Record not found')
                    navigate('/inactive-vehicles')
                    return
                }
                form.reset(found)
            } catch (error) {
                toast.error('Failed to load inactive vehicle data')
            } finally {
                setIsLoading(false)
            }
        }
        void load()
    }, [id, navigate, form])

    const onSubmit = async (values: UpdateInactiveValues) => {
        try {
            await mockApi.saveInactiveVehicle(values as InactiveVehicleRecord)
            toast.success('Downtime record updated')
            navigate('/inactive-vehicles')
        } catch (error) {
            toast.error('Failed to update inactivity logs')
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
    }

    const vehicleOptions = vehicles.map((v) => ({ label: v.registrationNumber, value: v.id }))

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/inactive-vehicles')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Modify Inactivity Record"
                    description="Update the downtime review status"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Case Information</h4>
                                <SelectField
                                    control={form.control}
                                    name="vehicleId"
                                    label="Inactive Vehicle"
                                    placeholder="Select from fleet"
                                    options={vehicleOptions}
                                />
                                <TextInputField control={form.control} name="reportedDate" label="Incident Date" type="date" />
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Context & Status</h4>
                                <TextAreaField control={form.control} name="description" label="Nature of Inactivity" placeholder="Reason for downtime (e.g. Total Loss, Stolen, Legal Issue)..." />
                                <SelectField
                                    control={form.control}
                                    name="status"
                                    label="Administrative Review"
                                    options={inactiveVehicleStatusOptions.map(t => ({ label: t.replace(/_/g, ' '), value: t }))}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/inactive-vehicles')}>Cancel</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">
                                    Apply Review
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
