import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useCreateVehicle, type CreateVehiclePayload } from '~/queries/vehicles'
import { useStations } from '~/queries/stations'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const createSchema = z.object({
    vehicleNumber: z.string().min(1, 'Registration number is required'),
    rcNumber: z.string().optional(),
    chassisNumber: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    gpsId: z.string().optional(),
    insuranceExpiry: z.string().optional(),
    stationId: z.string().optional(),
})

type CreateFormValues = z.infer<typeof createSchema>

export default function CreateVehicleRoute() {
    const navigate = useNavigate()
    const createVehicle = useCreateVehicle()
    const { data: stations } = useStations({ limit: 100 })

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(createSchema),
        defaultValues: {
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

    const stationOptions = useMemo(() => (stations?.data ?? []).map((s) => ({
        label: s.name,
        value: s.id,
    })), [stations?.data])

    const onSubmit = useCallback((values: CreateFormValues) => {
        const payload: CreateVehiclePayload = {
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
                                    <TextInputField control={form.control} name="vehicleNumber" label="Registration No." placeholder="e.g. MH 01 AB 1234" />
                                    <TextInputField control={form.control} name="gpsId" label="GPS Tracker ID" placeholder="e.g. GPS-9902" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="brand" label="Manufacturer / Brand" placeholder="Ola / Ather" />
                                    <TextInputField control={form.control} name="model" label="Vehicle Model" placeholder="450X" />
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
                                    <SelectField
                                        control={form.control}
                                        name="stationId"
                                        label="Assigned Station (Optional)"
                                        options={stationOptions}
                                        placeholder="Select a station"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/vehicles')}>Cancel</Button>
                                <Button type="submit" disabled={createVehicle.isPending} className="min-w-[140px] uppercase text-xs font-bold tracking-widest">
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
