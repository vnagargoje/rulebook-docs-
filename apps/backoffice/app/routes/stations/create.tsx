import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import { stationTypeOptions, type Station } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const createSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required'),
    type: z.enum(['HUB', 'SWAP_STATION', 'CHARGING_STATION']),
    address: z.object({
        line1: z.string().min(1, 'Address is required'),
        line2: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
    }),
    latitude: z.string().min(1, 'Latitude is required'),
    longitude: z.string().min(1, 'Longitude is required'),
    status: z.enum(['ACTIVE', 'INACTIVE']),
})

export type CreateFormValues = z.infer<typeof createSchema>

export default function CreateStationRoute() {
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(createSchema) as any,
        defaultValues: {
            name: '',
            code: '',
            type: 'SWAP_STATION',
            status: 'ACTIVE',
            address: { line1: '', line2: '', city: '', state: '', postalCode: '' },
            latitude: '',
            longitude: '',
        },
    })

    const onSubmit = async (values: CreateFormValues) => {
        try {
            await mockApi.saveStation(values as unknown as Station)
            toast.success('Station created successfully')
            navigate('/stations')
        } catch (error) {
            toast.error('Failed to save station')
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/stations')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Create New Station"
                    description="Register a new hub or swap station in the network"
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
                                    <TextInputField control={form.control} name="code" label="Internal Station Code" placeholder="STN-XXX" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <SelectField
                                        control={form.control}
                                        name="type"
                                        label="Facility Type"
                                        options={stationTypeOptions.map(t => ({ label: t.replace(/_/g, ' '), value: t }))}
                                    />
                                    <SelectField
                                        control={form.control}
                                        name="status"
                                        label="Operational Status"
                                        options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]}
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
                                <div className="space-y-6">
                                    <TextInputField control={form.control} name="address.line1" label="Address Line 1" placeholder="Building, Street, Landmark" />
                                    <TextInputField control={form.control} name="address.line2" label="Address Line 2 (Optional)" placeholder="Additional details" />
                                    <div className="grid grid-cols-3 gap-4">
                                        <TextInputField control={form.control} name="address.city" label="City" />
                                        <TextInputField control={form.control} name="address.state" label="State" />
                                        <TextInputField control={form.control} name="address.postalCode" label="PIN Code" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/stations')}>Cancel</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">
                                    Register Station
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
