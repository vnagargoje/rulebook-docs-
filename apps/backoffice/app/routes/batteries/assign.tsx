import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { MultiSelectField, SelectField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import type { Battery, Station } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const batteryAssignmentSchema = z.object({
    stationId: z.string().min(1, 'Station is required'),
    batteryIds: z.array(z.string()).min(1, 'At least one battery is required'),
})

export default function AssignBatteriesRoute() {
    const navigate = useNavigate()
    const [batteries, setBatteries] = useState<Battery[]>([])
    const [stations, setStations] = useState<Station[]>([])

    useEffect(() => {
        void Promise.all([
            mockApi.listBatteries(),
            mockApi.listStations()
        ]).then(([stock, hubs]) => {
            setBatteries(stock)
            setStations(hubs)
        })
    }, [])

    const form = useForm({
        resolver: zodResolver(batteryAssignmentSchema) as any,
        defaultValues: { stationId: '', batteryIds: [] },
    })

    const onSubmit = async (values: z.infer<typeof batteryAssignmentSchema>) => {
        try {
            await mockApi.assignBatteriesToStation(values)
            toast.success('Batteries assigned to station')
            navigate('/batteries')
        } catch (error) {
            toast.error('Failed to assign batteries')
        }
    }

    const stationOptions = stations.map(s => ({ label: s.name, value: s.id }))
    const unassignedBatteries = batteries.filter(b => b.status === 'AVAILABLE' && !b.stationId)
    const batteryOptions = unassignedBatteries.map(b => ({ label: `${b.batteryCode} (${b.capacityAh}Ah)`, value: b.id }))

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/batteries')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Assign Batteries to Station"
                    description="Allocate stock to swapping hubs"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            
                            <SelectField
                                control={form.control}
                                name="stationId"
                                label="Target Station"
                                placeholder="Select Station"
                                options={stationOptions}
                            />

                            <MultiSelectField
                                control={form.control}
                                name="batteryIds"
                                label="Select Batteries"
                                placeholder="Choose one or more batteries"
                                options={batteryOptions}
                            />

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/batteries')}>Cancel</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">Complete Allocation</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
