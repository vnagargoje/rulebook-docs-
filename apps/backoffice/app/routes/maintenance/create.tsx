import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextAreaField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import { maintenanceStatusOptions, type MaintenanceRecord, type Vehicle } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const createSchema = z.object({
    reportedDate: z.string().min(1, 'Reported date is required'),
    vehicleId: z.string().min(1, 'Vehicle is required'),
    issueDescription: z.string().min(1, 'Description is required'),
    technicianName: z.string().min(1, 'Technician name is required'),
    expectedFixDate: z.string().min(1, 'Expected fix date is required'),
    status: z.enum(['REPORTED', 'IN_PROGRESS', 'RESOLVED']),
})

export type CreateMaintenanceValues = z.infer<typeof createSchema>

export default function CreateMaintenanceRoute() {
    const navigate = useNavigate()
    const [vehicles, setVehicles] = useState<Vehicle[]>([])

    useEffect(() => {
        void mockApi.listVehicles().then(setVehicles)
    }, [])

    const form = useForm({
        resolver: zodResolver(createSchema) as any,
        defaultValues: {
            reportedDate: new Date().toISOString().slice(0, 10),
            vehicleId: '',
            issueDescription: '',
            technicianName: '',
            expectedFixDate: '',
            status: 'REPORTED',
        },
    })

    const onSubmit = async (values: CreateMaintenanceValues) => {
        try {
            await mockApi.saveMaintenance(values as unknown as MaintenanceRecord)
            toast.success('Maintenance event logged successfully')
            navigate('/maintenance')
        } catch (error) {
            toast.error('Failed to log maintenance event')
        }
    }

    const vehicleOptions = vehicles.map((v) => ({ label: `${v.registrationNumber} (${v.model})`, value: v.id }))

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/maintenance')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Log Maintenance Event"
                    description="Register a vehicle into the workshop for repairs"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Asset Information</h4>
                                <SelectField
                                    control={form.control}
                                    name="vehicleId"
                                    label="Target Vehicle"
                                    placeholder="Select Vehicle from Fleet"
                                    options={vehicleOptions}
                                />
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="reportedDate" label="Reported Date" type="date" />
                                    <TextInputField control={form.control} name="expectedFixDate" label="Estimated Recovery" type="date" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Technical Details</h4>
                                <TextInputField control={form.control} name="technicianName" label="Assigned Technician" placeholder="Primary service engineer name" />
                                <TextAreaField control={form.control} name="issueDescription" label="Diagnosis & Remarks" placeholder="Detailed description of reported faults..." />
                                <SelectField
                                    control={form.control}
                                    name="status"
                                    label="Workflow Status"
                                    options={maintenanceStatusOptions.map(t => ({ label: t.replace(/_/g, ' '), value: t }))}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/maintenance')}>Cancel</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">
                                    Create Record
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
