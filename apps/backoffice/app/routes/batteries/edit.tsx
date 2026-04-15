import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { CheckboxField, SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import { batteryStatusOptions, type Battery } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const updateSchema = z.object({
    id: z.string(),
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

export type UpdateBatteryValues = z.infer<typeof updateSchema>

export default function EditBatteryRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    const form = useForm({
        resolver: zodResolver(updateSchema) as any,
    })

    useEffect(() => {
        const load = async () => {
            try {
                const stock = await mockApi.listBatteries()
                const found = stock.find(b => b.id === id)
                if (!found) {
                    toast.error('Battery not found')
                    navigate('/batteries')
                    return
                }
                form.reset(found)
            } catch (error) {
                toast.error('Failed to load battery data')
            } finally {
                setIsLoading(false)
            }
        }
        void load()
    }, [id, navigate, form])

    const onSubmit = async (values: UpdateBatteryValues) => {
        try {
            await mockApi.saveBattery(values as Battery)
            toast.success('Battery updated')
            navigate('/batteries')
        } catch (error) {
            toast.error('Failed to update battery')
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/batteries')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Edit Battery Details"
                    description="Update hardware specifications and warranty"
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
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">Save Changes</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
