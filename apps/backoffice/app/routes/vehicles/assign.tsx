import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { MultiSelectField, SearchableSelectField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useInfiniteVehicles, useUpdateVehicle } from '~/queries/vehicles'
import { useInfiniteStations } from '~/queries/stations'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { useCallback, useMemo, useState } from 'react'
import { vehicleAssignmentSchema, type VehicleAssignmentValues } from '~/schemas'

export default function AssignVehiclesRoute() {
    const navigate = useNavigate()
    const { data: stationsData, isFetching: isStationsFetching, fetchNextPage: fetchNextStationPage, hasNextPage: hasNextStationPage } = useInfiniteStations()
    const updateVehicle = useUpdateVehicle()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<VehicleAssignmentValues>({
        resolver: zodResolver(vehicleAssignmentSchema),
        defaultValues: { stationId: '', vehicleIds: [] as string[] },
    })

    const { data: vehiclesData, isFetching: isVehiclesFetching, fetchNextPage: fetchNextVehiclePage, hasNextPage: hasNextVehiclePage } = useInfiniteVehicles({
        'filter.type': ['$eq:rental'],
    })

    const onSubmit = useCallback(
        async (values: VehicleAssignmentValues) => {
            setIsSubmitting(true)
            try {
                await Promise.all(
                    values.vehicleIds.map((id) => {
                        return updateVehicle.mutateAsync({
                            id,
                            data: { stationId: values.stationId },
                        })
                    }),
                )
                toast.success('Vehicle(s) assigned successfully.')
                navigate('/vehicles')
            } catch {
                toast.error('Failed to assign some vehicles')
            } finally {
                setIsSubmitting(false)
            }
        },
        [vehiclesData?.pages, updateVehicle, navigate],
    )

    const stationOptions = useMemo(
        () => (stationsData?.pages ?? []).flatMap((p) => p.data).map((s) => ({ label: s.name, value: s.id })),
        [stationsData?.pages],
    )

    const unassignedVehicles = useMemo(
        () => (vehiclesData?.pages ?? []).flatMap((p) => p.data).filter((v) => !v.stationId),
        [vehiclesData?.pages],
    )

    const vehicleOptions = useMemo(
        () =>
            unassignedVehicles.map((v) => ({
                label: `${v.vehicleNumber} (${v.properties?.brand ?? ''} ${v.properties?.model ?? ''})`.trim(),
                value: v.id,
            })),
        [unassignedVehicles],
    )

    return (
        <div className='space-y-6 max-w-4xl mx-auto pb-12'>
            <div className='flex items-center gap-4'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => navigate(-1)}
                    className='shrink-0'>
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title='Assign Vehicles to Station'
                    description='Allocate fleet vehicles to swapping hubs'
                />
            </div>

            <Card className='border-border/40 shadow-sm bg-white overflow-hidden'>
                <CardContent className='p-8'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6'>
                            <SearchableSelectField
                                control={form.control}
                                name='stationId'
                                label='Destination Station'
                                placeholder='Select Station'
                                options={stationOptions}
                                isLoading={isStationsFetching}
                                onLoadMore={fetchNextStationPage}
                                hasNextPage={hasNextStationPage}
                            />

                            <MultiSelectField
                                control={form.control}
                                name='vehicleIds'
                                label='Select Vehicles'
                                placeholder='Choose one or more vehicles'
                                options={vehicleOptions}
                                isLoading={isVehiclesFetching}
                                onLoadMore={fetchNextVehiclePage}
                                hasNextPage={hasNextVehiclePage}
                            />

                            <div className='flex justify-end gap-3 pt-6 border-t mt-4'>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => navigate('/vehicles')}>
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='min-w-35 uppercase text-xs font-bold tracking-widest'>
                                    {isSubmitting ? 'Assigning...' : 'Assign Vehicle'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
