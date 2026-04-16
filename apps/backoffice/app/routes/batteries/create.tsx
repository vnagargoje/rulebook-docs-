import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { CheckboxField, SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import { batteryStatusOptions, type Battery } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const createSchema = z.object({
    batteryCode: z.string().min(1, 'Code is required'),
    manufacturedAt: z.string().min(1, 'Date is required'),
    gpsId: z.string().min(1, 'GPS ID is required'),
    capacityAh: z.coerce.number().min(0, 'Capacity must be >= 0'),
    rangeKm: z.coerce.number().min(0, 'Range must be >= 0'),
    lifecycleCount: z.coerce.number().min(0, 'Count must be >= 0'),
    chargingTimeHours: z.coerce.number().min(0, 'Time must be >= 0'),
    weightKg: z.coerce.number().min(0, 'Weight must be >= 0'),
    warrantyUntil: z.string().min(1, 'Date is required'),
    removable: z.boolean(),
    status: z.enum(['AVAILABLE', 'IN_USE', 'IN_TRANSIT', 'NEEDS_CHARGE']),
})

export type CreateBatteryValues = z.infer<typeof createSchema>

export default function CreateBatteryRoute() {
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(createSchema),
        defaultValues: {
            batteryCode: '',
            manufacturedAt: '',
            gpsId: '',
            capacityAh: 40,
            rangeKm: 80,
            lifecycleCount: 0,
            chargingTimeHours: 4,
            weightKg: 15,
            warrantyUntil: '',
            removable: true,
            status: 'AVAILABLE' as const,
        },
    })

    const onSubmit = async (values: z.infer<typeof createSchema>) => {
        try {
            await mockApi.saveBattery(values as unknown as Battery)
            toast.success('Battery added successfully')
            navigate('/batteries')
        } catch (error) {
            toast.error('Failed to save battery')
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/batteries')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Register New Battery"
                    description="Add a new battery to the inventory pool"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            
                            <div className="grid grid-cols-2 gap-6">
                                <TextInputField control={form.control} name="batteryCode" label="Battery Code" placeholder="BAT-XX-123" />
                                <TextInputField control={form.control} name="gpsId" label="GPS Tracker ID" placeholder="GPS-445" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <TextInputField control={form.control} name="capacityAh" label="Capacity (Ah)" type="number" />
                                <TextInputField control={form.control} name="rangeKm" label="Range (km)" type="number" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <TextInputField control={form.control} name="lifecycleCount" label="Lifecycle Count" type="number" />
                                <TextInputField control={form.control} name="chargingTimeHours" label="Charging Time (Hrs)" type="number" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <TextInputField control={form.control} name="weightKg" label="Weight (kg)" type="number" />
                                <TextInputField control={form.control} name="manufacturedAt" label="Manufactured Date" type="date" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <TextInputField control={form.control} name="warrantyUntil" label="Warranty Until" type="date" />
                                <SelectField
                                    control={form.control}
                                    name="status"
                                    label="Status"
                                    options={batteryStatusOptions.map(t => ({ label: t.replace(/_/g, ' '), value: t }))}
                                />
                            </div>

                            <CheckboxField control={form.control} name="removable" label="Is Battery Removable?" />

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/batteries')}>Cancel</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">Register Battery</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
