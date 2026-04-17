import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useGetStationById, useUpdateStation, type UpdateStationPayload } from '~/queries/stations'
import { useUsers } from '~/queries/users'
import { useStates, useCities } from '~/hooks'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const stationTypeOptions = [
    { label: 'Swap Station', value: 'swap_station' },
    { label: 'Hub Station', value: 'hub_station' },
] as const

const updateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['swap_station', 'hub_station']),
    active: z.enum(['true', 'false']),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    managerId: z.string().optional(),
    stateId: z.string().optional(),
    cityId: z.string().optional(),
    lineOne: z.string().optional(),
    lineTwo: z.string().optional(),
    pincode: z.string().optional(),
})

type UpdateFormValues = z.infer<typeof updateSchema>

export default function EditStationRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: station, isLoading } = useGetStationById(id)
    const updateStation = useUpdateStation()
    const { data: managers } = useUsers({ limit: 100, 'filter.roles.name': ['$in:swap_manager,hub_manager'] })
    const { data: states } = useStates()

    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            name: '',
            type: 'swap_station',
            active: 'true',
            latitude: '',
            longitude: '',
            managerId: '',
            stateId: '',
            cityId: '',
            lineOne: '',
            lineTwo: '',
            pincode: '',
        },
    })

    const selectedStateId = form.watch('stateId')
    const { data: cities } = useCities(selectedStateId || undefined)

    const managerOptions = useMemo(() => (managers?.data ?? []).map((u) => ({
        label: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || u.mobilenumber || u.id,
        value: u.id,
    })), [managers?.data])
    const stateOptions = useMemo(() => (states ?? []).map((s) => ({ label: s.name, value: s.id })), [states])
    const cityOptions = useMemo(() => (cities ?? []).map((c) => ({ label: c.name, value: c.id })), [cities])

    useEffect(() => {
        if (station) {
            form.reset({
                name: station.name ?? '',
                type: station.type ?? 'swap_station',
                active: station.active ? 'true' : 'false',
                latitude: station.latitude?.toString() ?? '',
                longitude: station.longitude?.toString() ?? '',
                managerId: station.managerId ?? '',
                stateId: station.address?.city?.state?.id ?? '',
                cityId: station.address?.city?.id ?? '',
                lineOne: station.address?.lineOne ?? '',
                lineTwo: station.address?.lineTwo ?? '',
                pincode: station.address?.pincode ?? '',
            })
        }
    }, [station, form])

    const onSubmit = useCallback((values: UpdateFormValues) => {
        if (!id) return

        const payload: UpdateStationPayload = {
            name: values.name,
            type: values.type,
            active: values.active === 'true',
            latitude: values.latitude ? parseFloat(values.latitude) : undefined,
            longitude: values.longitude ? parseFloat(values.longitude) : undefined,
            managerId: values.managerId || undefined,
        }

        if (values.lineOne) {
            payload.address = {
                lineOne: values.lineOne,
                lineTwo: values.lineTwo || undefined,
                pincode: values.pincode || '',
                cityId: values.cityId || undefined,
            }
        }

        updateStation.mutate(
            { id, data: payload },
            {
                onSuccess: () => {
                    toast.success('Station updated successfully')
                    navigate('/stations')
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'Failed to update station')
                },
            },
        )
    }, [id, updateStation, navigate])

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
    }

    if (!station) {
        return <div className="p-8 text-center text-muted-foreground font-bold tracking-widest text-sm uppercase">Station not found</div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/stations')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Edit Station Config"
                    description="Update station operational data"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Identity & Classification</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="name" label="Station Name" placeholder="e.g. Bandra West Hub" />
                                    <SelectField
                                        control={form.control}
                                        name="type"
                                        label="Facility Type"
                                        options={[...stationTypeOptions]}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <SelectField
                                        control={form.control}
                                        name="active"
                                        label="Operational Status"
                                        options={[{ label: 'Active', value: 'true' }, { label: 'Inactive', value: 'false' }]}
                                    />
                                    <SelectField
                                        control={form.control}
                                        name="managerId"
                                        label="Station Manager (Optional)"
                                        options={managerOptions}
                                        placeholder="Select a manager"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Geospatial Info</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="latitude" label="Latitude Coordinate" placeholder="19.0760" />
                                    <TextInputField control={form.control} name="longitude" label="Longitude Coordinate" placeholder="72.8777" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Physical Location</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="lineOne" label="Address Line 1" placeholder="Building, Street, Landmark" />
                                    <TextInputField control={form.control} name="lineTwo" label="Address Line 2 (Optional)" placeholder="Additional details" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <SelectField
                                        control={form.control}
                                        name="stateId"
                                        label="State"
                                        options={stateOptions}
                                        placeholder="Select state"
                                    />
                                    <SelectField
                                        control={form.control}
                                        name="cityId"
                                        label="City"
                                        options={cityOptions}
                                        placeholder={selectedStateId ? 'Select city' : 'Select state first'}
                                        key={selectedStateId || 'no-state'}
                                    />
                                    <TextInputField control={form.control} name="pincode" label="PIN Code" placeholder="400001" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/stations')}>Cancel</Button>
                                <Button type="submit" disabled={updateStation.isPending} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {updateStation.isPending ? 'Updating...' : 'Update Station'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
