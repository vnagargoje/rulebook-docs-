import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SearchableSelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useInfiniteStations } from '~/queries/stations'
import { useUpdateVehicle, useInfiniteVehicles } from '~/queries/vehicles'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { stationAssignmentSchema, type StationAssignmentValues } from '~/schemas'

export default function CreateStationAssignmentRoute() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const preselectedStationId = searchParams.get('stationId') ?? ''
    const updateVehicle = useUpdateVehicle()
    const { data: vehiclesData, isFetching: isVehiclesFetching, fetchNextPage: fetchNextVehiclePage, hasNextPage: hasNextVehiclePage } = useInfiniteVehicles({
        sortBy: ['createdAt:DESC'],
        'filter.stationId': ['$null'],
    })
    const { data: stationsData, isFetching: isStationsFetching, fetchNextPage: fetchNextStationPage, hasNextPage: hasNextStationPage } = useInfiniteStations({
        sortBy: ['createdAt:DESC'],
        'filter.type': ['$eq:vehicle_station'],
    })

    const form = useForm<StationAssignmentValues>({
        resolver: zodResolver(stationAssignmentSchema),
        mode: 'onChange',
        defaultValues: { vehicleId: '', vehicleNumber: '', stationId: preselectedStationId },
    })

    const allVehicles = (vehiclesData?.pages ?? []).flatMap((p) => p.data)
    const selectedVehicleId = form.watch('vehicleId')

    const selectedVehicle = useMemo(
        () => allVehicles.find((vehicle) => vehicle.id === selectedVehicleId),
        [allVehicles, selectedVehicleId],
    )

    useEffect(() => {
        form.setValue('vehicleNumber', selectedVehicle?.vehicleNumber ?? '')
    }, [form, selectedVehicle?.vehicleNumber])

    const vehicleOptions = useMemo(
        () => allVehicles.map((vehicle) => ({
            label: vehicle.vehicleNumber ?? vehicle.id,
            value: vehicle.id,
        })),
        [allVehicles],
    )

    const stationOptions = useMemo(
        () => (stationsData?.pages ?? []).flatMap((p) => p.data).map((station) => ({
            label: station.name ?? station.id,
            value: station.id,
        })),
        [stationsData?.pages],
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

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
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

                            <SearchableSelectField
                                control={form.control}
                                name="vehicleId"
                                label="Vehicle Selection"
                                placeholder="Select Vehicle"
                                options={vehicleOptions}
                                isLoading={isVehiclesFetching}
                                onLoadMore={fetchNextVehiclePage}
                                hasNextPage={hasNextVehiclePage}
                                required
                            />

                            <TextInputField
                                control={form.control}
                                name="vehicleNumber"
                                label="Vehicle Number"
                                placeholder="Vehicle number will appear after selection"
                                disabled
                            />

                            <SearchableSelectField
                                control={form.control}
                                name="stationId"
                                label="Station Selection"
                                placeholder="Select Station"
                                options={stationOptions}
                                isLoading={isStationsFetching}
                                onLoadMore={fetchNextStationPage}
                                hasNextPage={hasNextStationPage}
                                required
                            />

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/assignments')}>Cancel</Button>
                                <Button type="submit" disabled={updateVehicle.isPending || !form.formState.isValid} className="min-w-35 uppercase text-xs font-bold tracking-widest">
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
