import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { CheckboxField, SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useGetBatteryById, useUpdateBattery } from '~/queries/batteries'
import { useStations } from '~/queries/stations'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { updateBatterySchema, type UpdateBatteryFormValues } from '~/schemas'

export default function EditBatteryRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: battery, isLoading } = useGetBatteryById(id)
    const updateBattery = useUpdateBattery()
    const { data: stations } = useStations({ limit: 100 })

    const form = useForm<UpdateBatteryFormValues>({
        resolver: zodResolver(updateBatterySchema),
        defaultValues: {
            batteryCode: '',
            gpsId: '',
            capacity: '',
            range: '',
            lifecycle: '',
            chargingTime: '',
            weight: '',
            mfgDate: '',
            warranty: '',
            removable: true,
            stationId: '',
        },
    })

    useEffect(() => {
        if (!battery) return
        const props = battery.properties ?? {}
        form.reset({
            batteryCode: battery.batteryId ?? '',
            gpsId: battery.gpsId ?? '',
            capacity: props.capacity ?? '',
            range: props.range ?? '',
            lifecycle: props.lifecycle ?? '',
            chargingTime: props.chargingTime ?? '',
            weight: props.weight ?? '',
            mfgDate: props.mfgDate ? String(props.mfgDate).slice(0, 10) : '',
            warranty: props.warranty ? String(props.warranty).slice(0, 10) : '',
            removable: props.removableOption ?? true,
            stationId: battery.stationId ?? '',
        })
    }, [battery, form])

    const stationOptions = useMemo(() => (stations?.data ?? []).map((s) => ({
        label: s.name,
        value: s.id,
    })), [stations?.data])

    const onSubmit = useCallback((values: UpdateBatteryFormValues) => {
        if (!id) return

        updateBattery.mutate({
            id,
            data: {
                batteryId: values.batteryCode,
                gpsId: values.gpsId || undefined,
                stationId: values.stationId || undefined,
                properties: {
                    capacity: values.capacity || undefined,
                    range: values.range || undefined,
                    lifecycle: values.lifecycle || undefined,
                    chargingTime: values.chargingTime || undefined,
                    weight: values.weight || undefined,
                    mfgDate: values.mfgDate || undefined,
                    warranty: values.warranty || undefined,
                    removableOption: values.removable,
                },
            },
        }, {
            onSuccess: () => {
                toast.success('Battery updated')
                navigate('/batteries')
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to update battery')
            },
        })
    }, [id, updateBattery, navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
    }

    if (!battery) {
        return <div className="p-8 text-center text-muted-foreground">Battery not found</div>
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
                                <TextInputField control={form.control} name="capacity" label="Capacity (Ah)" placeholder="e.g. 40" />
                                <TextInputField control={form.control} name="range" label="Range (km)" placeholder="e.g. 80" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <TextInputField control={form.control} name="lifecycle" label="Lifecycle Count" placeholder="e.g. 500" />
                                <TextInputField control={form.control} name="chargingTime" label="Charging Time (Hrs)" placeholder="e.g. 4" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <TextInputField control={form.control} name="weight" label="Weight (kg)" placeholder="e.g. 15" />
                                <TextInputField control={form.control} name="mfgDate" label="Manufactured Date" type="date" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <TextInputField control={form.control} name="warranty" label="Warranty Until" type="date" />
                                <SelectField
                                    control={form.control}
                                    name="stationId"
                                    label="Assigned Station (Optional)"
                                    options={stationOptions}
                                    placeholder="Select a station"
                                />
                            </div>

                            <CheckboxField control={form.control} name="removable" label="Is Battery Removable?" />

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/batteries')}>Cancel</Button>
                                <Button type="submit" disabled={updateBattery.isPending} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {updateBattery.isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
