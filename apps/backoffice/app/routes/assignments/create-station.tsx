import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useStations } from '~/queries/stations'
import { useUpdateVehicle, useVehicles } from '~/queries/vehicles'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { stationAssignmentSchema, type StationAssignmentValues } from '~/schemas'

export default function CreateStationAssignmentRoute() {
    const navigate = useNavigate()
    const updateVehicle = useUpdateVehicle()
    const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles({ limit: 200, sortBy: ['createdAt:DESC'] })
    const { data: stationsData, isLoading: isStationsLoading } = useStations({ limit: 200, sortBy: ['createdAt:DESC'] })

    const form = useForm<StationAssignmentValues>({
        resolver: zodResolver(stationAssignmentSchema),
        defaultValues: { vehicleId: '', vehicleNumber: '', stationId: '' },
    })

    const allVehicles = vehiclesData?.data ?? []
    const selectedVehicleId = form.watch('vehicleId')

    const unassignedVehicles = useMemo(
        () => allVehicles.filter((vehicle) => !vehicle.stationId),
        [allVehicles],
    )

    const selectedVehicle = useMemo(
        () => allVehicles.find((vehicle) => vehicle.id === selectedVehicleId),
        [allVehicles, selectedVehicleId],
    )

    useEffect(() => {
        form.setValue('vehicleNumber', selectedVehicle?.vehicleNumber ?? '')
    }, [form, selectedVehicle?.vehicleNumber])

    const vehicleOptions = useMemo(
        () => unassignedVehicles.map((vehicle) => ({
            label: vehicle.vehicleNumber ?? vehicle.id,
            value: vehicle.id,
        })),
        [unassignedVehicles],
    )

    const stationOptions = useMemo(
        () => (stationsData?.data ?? []).map((station) => ({
            label: station.name ?? station.id,
            value: station.id,
        })),
        [stationsData?.data],
    )

    const onSubmit = useCallback((values: StationAssignmentValues) => {
        const vehicle = allVehicles.find((item) => item.id === values.vehicleId)

        if (!vehicle) {
            toast.error('Selected vehicle could not be found')
            return
        }

        if (vehicle.stationId) {
            toast.error('This vehicle is already assigned to a station')
            return
        }

        updateVehicle.mutate({
            id: vehicle.id,
            data: {
                vehicleNumber: vehicle.vehicleNumber,
                rcNumber: vehicle.rcNumber,
                chassisNumber: vehicle.chassisNumber,
                gpsId: vehicle.gpsId,
                properties: vehicle.properties,
                stationId: values.stationId,
            },
        }, {
            onSuccess: () => {
                toast.success('Vehicle assigned to station')
                navigate('/assignments')
            },
            onError: () => {
                toast.error('Failed to assign vehicle')
            },
        })
    }, [allVehicles, navigate, updateVehicle])

    if (isVehiclesLoading || isStationsLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Assignment Form...</div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/assignments')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Station Assignment"
                    description="Allocate an available vehicle to an operational station"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <SelectField
                                control={form.control}
                                name="vehicleId"
                                label="Vehicle Selection"
                                placeholder="Select Vehicle"
                                options={vehicleOptions}
                            />

                            <TextInputField
                                control={form.control}
                                name="vehicleNumber"
                                label="Vehicle Number"
                                placeholder="Vehicle number will appear after selection"
                                disabled
                            />

                            <SelectField
                                control={form.control}
                                name="stationId"
                                label="Station Selection"
                                placeholder="Select Station"
                                options={stationOptions}
                            />

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/assignments')}>Cancel</Button>
                                <Button type="submit" disabled={updateVehicle.isPending} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {updateVehicle.isPending ? 'Assigning...' : 'Assign Vehicle'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
