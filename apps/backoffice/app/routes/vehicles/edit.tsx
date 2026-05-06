import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SearchableSelectField, SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useGetVehicleById, useUpdateVehicle, type UpdateVehiclePayload } from '~/queries/vehicles'
import { useInfiniteStations } from '~/queries/stations'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { updateVehicleSchema, type UpdateVehicleFormValues } from '~/schemas'
import { vehicleTypeOptions } from '~/constants'

export default function EditVehicleRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: vehicle, isLoading } = useGetVehicleById(id)
    const updateVehicle = useUpdateVehicle()
    const { data: stations, isFetching: isStationsFetching, fetchNextPage: fetchNextStationPage, hasNextPage: hasNextStationPage } = useInfiniteStations()

    const form = useForm<UpdateVehicleFormValues>({
        resolver: zodResolver(updateVehicleSchema),
        mode: 'onChange',
        defaultValues: {
            type: undefined,
            vehicleNumber: '',
            rcNumber: '',
            chassisNumber: '',
            brand: '',
            model: '',
            gpsId: '',
            insuranceExpiry: '',
            stationId: '',
        },
    })

    const stationOptions = useMemo(() => (stations?.pages ?? []).flatMap((p) => p.data).map((s) => ({
        label: s.name,
        value: s.id,
    })), [stations?.pages])

    useEffect(() => {
        if (vehicle) {
            form.reset({
                type: (vehicle.type as 'rental' | 'transport') ?? undefined,
                vehicleNumber: vehicle.vehicleNumber ?? '',
                rcNumber: vehicle.rcNumber ?? '',
                chassisNumber: vehicle.chassisNumber ?? '',
                brand: vehicle.properties?.brand ?? '',
                model: vehicle.properties?.model ?? '',
                gpsId: vehicle.gpsId ?? '',
                insuranceExpiry: vehicle.properties?.insuranceExpiry ?? '',
                stationId: vehicle.stationId ?? '',
            })
        }
    }, [vehicle, form])

    const onSubmit = useCallback((values: UpdateVehicleFormValues) => {
        if (!id) return

        const payload: UpdateVehiclePayload = {
            type: values.type || undefined,
            vehicleNumber: values.vehicleNumber || undefined,
            rcNumber: values.rcNumber || undefined,
            chassisNumber: values.chassisNumber || undefined,
            gpsId: values.gpsId || undefined,
            stationId: values.stationId || undefined,
            properties: {
                brand: values.brand || undefined,
                model: values.model || undefined,
                insuranceExpiry: values.insuranceExpiry || undefined,
            },
        }

        updateVehicle.mutate(
            { id, data: payload },
            {
                onSuccess: () => {
                    toast.success('Vehicle updated successfully')
                    navigate('/vehicles')
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'Failed to update vehicle')
                },
            },
        )
    }, [id, updateVehicle, navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
    }

    if (!vehicle) {
        return <div className="p-8 text-center text-muted-foreground font-bold tracking-widest text-sm uppercase">Vehicle not found</div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/vehicles')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Modify Fleet Item"
                    description="Update hardware and registration data"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Vehicle Profile</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="vehicleNumber" label="Registration No." placeholder="e.g. MH 01 AB 1234" required />
                                    <SelectField
                                        control={form.control}
                                        name="type"
                                        label="Vehicle Type"
                                        options={vehicleTypeOptions}
                                        placeholder="Select type"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="brand" label="Manufacturer / Brand" placeholder="Ola / Ather" />
                                    <TextInputField control={form.control} name="model" label="Vehicle Model" placeholder="450X" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="gpsId" label="GPS Tracker ID" placeholder="e.g. GPS-9902" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Registration Identifiers</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="rcNumber" label="RC Smartcard No." />
                                    <TextInputField control={form.control} name="chassisNumber" label="Chassis Number" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="insuranceExpiry" label="Insurance Expiry Date" type="date" />
                                    <SearchableSelectField
                                        control={form.control}
                                        name="stationId"
                                        label="Assigned Station (Optional)"
                                        options={stationOptions}
                                        placeholder="Select a station"
                                        isLoading={isStationsFetching}
                                        onLoadMore={fetchNextStationPage}
                                        hasNextPage={hasNextStationPage}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/vehicles')}>Cancel</Button>
                                <Button type="submit" disabled={updateVehicle.isPending || !form.formState.isDirty} className="min-w-[140px] uppercase text-xs font-bold tracking-widest">
                                    {updateVehicle.isPending ? 'Updating...' : 'Update Asset'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
