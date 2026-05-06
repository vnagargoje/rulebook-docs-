import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SearchableSelectField, SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useCreateVehicle, type CreateVehiclePayload } from '~/queries/vehicles'
import { useInfiniteStations } from '~/queries/stations'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { createVehicleSchema, type CreateVehicleFormValues } from '~/schemas'
import { vehicleTypeOptions } from '~/constants'

export default function CreateVehicleRoute() {
    const navigate = useNavigate()
    const createVehicle = useCreateVehicle()
    const { data: stations, isFetching: isStationsFetching, fetchNextPage: fetchNextStationPage, hasNextPage: hasNextStationPage } = useInfiniteStations()

    const form = useForm<CreateVehicleFormValues>({
        resolver: zodResolver(createVehicleSchema),
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

    const onSubmit = useCallback((values: CreateVehicleFormValues) => {
        const payload: CreateVehiclePayload = {
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

        createVehicle.mutate(payload, {
            onSuccess: () => {
                toast.success('Vehicle registered successfully')
                navigate('/vehicles')
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to register vehicle')
            },
        })
    }, [createVehicle, navigate])

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/vehicles')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Register New Asset"
                    description="Add a new vehicle to the operations pool"
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
                                <Button type="submit" disabled={createVehicle.isPending || !form.formState.isValid} className="min-w-[140px] uppercase text-xs font-bold tracking-widest">
                                    {createVehicle.isPending ? 'Registering...' : 'Register Fleet'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
