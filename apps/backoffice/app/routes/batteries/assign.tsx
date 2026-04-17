import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { MultiSelectField, SelectField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useBatteries, useUpdateBattery } from '~/queries/batteries'
import { useStations } from '~/queries/stations'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { useCallback, useMemo, useState } from 'react'

const batteryAssignmentSchema = z.object({
    stationId: z.string().min(1, 'Station is required'),
    batteryIds: z.array(z.string()).min(1, 'At least one battery is required'),
})

type BatteryAssignmentValues = z.infer<typeof batteryAssignmentSchema>

export default function AssignBatteriesRoute() {
    const navigate = useNavigate()
    const { data: batteriesData } = useBatteries({ limit: 200 })
    const { data: stationsData } = useStations({ limit: 100 })
    const updateBattery = useUpdateBattery()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<BatteryAssignmentValues>({
        resolver: zodResolver(batteryAssignmentSchema),
        defaultValues: { stationId: '', batteryIds: [] as string[] },
    })

    const onSubmit = useCallback(async (values: BatteryAssignmentValues) => {
        setIsSubmitting(true)
        try {
            const allBatteries = batteriesData?.data ?? []
            await Promise.all(
                values.batteryIds.map((id) => {
                    const bat = allBatteries.find((b) => b.id === id)
                    return updateBattery.mutateAsync({
                        id,
                        data: { batteryId: bat?.batteryId ?? '', stationId: values.stationId },
                    })
                }),
            )
            toast.success('Batteries assigned to station')
            navigate('/batteries')
        } catch {
            toast.error('Failed to assign some batteries')
        } finally {
            setIsSubmitting(false)
        }
    }, [batteriesData?.data, updateBattery, navigate])

    const stationOptions = useMemo(() => (stationsData?.data ?? []).map((s) => ({ label: s.name, value: s.id })), [stationsData?.data])
    const unassignedBatteries = useMemo(() => (batteriesData?.data ?? []).filter((b) => !b.stationId), [batteriesData?.data])
    const batteryOptions = useMemo(() => unassignedBatteries.map((b) => ({
        label: `${b.batteryId} (${b.properties?.capacity ?? '?'}Ah)`,
        value: b.id,
    })), [unassignedBatteries])

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
                                <Button type="submit" disabled={isSubmitting} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {isSubmitting ? 'Assigning...' : 'Complete Allocation'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
