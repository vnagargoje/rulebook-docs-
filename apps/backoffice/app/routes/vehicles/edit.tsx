import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import { vehicleStatusOptions, type Vehicle } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const updateSchema = z.object({
    id: z.string(),
    registrationNumber: z.string().min(1, 'Registration number is required'),
    rcNumber: z.string().min(1, 'RC number is required'),
    chassisNumber: z.string().min(1, 'Chassis number is required'),
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    gpsId: z.string().min(1, 'GPS ID is required'),
    insuranceExpiry: z.string().min(1, 'Insurance Expiry is required'),
    status: z.enum(['AVAILABLE', 'ASSIGNED_TO_STATION', 'ASSIGNED_TO_CUSTOMER', 'IN_MAINTENANCE', 'INACTIVE']),
})

export type UpdateFormValues = z.infer<typeof updateSchema>

export default function EditVehicleRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    const form = useForm({
        resolver: zodResolver(updateSchema) as any,
    })

    useEffect(() => {
        const load = async () => {
            try {
                const vehicles = await mockApi.listVehicles()
                const found = vehicles.find(v => v.id === id)
                if (!found) {
                    toast.error('Vehicle not found')
                    navigate('/vehicles')
                    return
                }
                form.reset({
                    id: found.id,
                    registrationNumber: found.registrationNumber,
                    rcNumber: found.rcNumber,
                    chassisNumber: found.chassisNumber,
                    brand: found.brand,
                    model: found.model,
                    gpsId: found.gpsId,
                    insuranceExpiry: found.insuranceExpiry,
                    status: found.status,
                })
            } catch (error) {
                toast.error('Failed to load vehicle data')
            } finally {
                setIsLoading(false)
            }
        }
        void load()
    }, [id, navigate, form])

    const onSubmit = async (values: UpdateFormValues) => {
        try {
            await mockApi.saveVehicle(values as Vehicle)
            toast.success('Vehicle updated successfully')
            navigate('/vehicles')
        } catch (error) {
            toast.error('Failed to update vehicle')
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
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
                                    <TextInputField control={form.control} name="registrationNumber" label="Registration No." placeholder="e.g. MH 01 AB 1234" />
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
                                        name="status"
                                        label="Fleet Status"
                                        options={vehicleStatusOptions.map(t => ({ label: t.replace(/_/g, ' '), value: t }))}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/vehicles')}>Cancel</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">
                                    Update Asset
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
