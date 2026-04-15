import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import { userRoleOptions, type User, type Station } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const createSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    mobile: z.string().min(10, 'Mobile is required'),
    email: z.string().email('Invalid email'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    dob: z.string().min(1, 'Date of Birth is required'),
    role: z.enum(['HUB_MANAGER', 'SWAP_STATION_MANAGER', 'CUSTOMER']),
    stationId: z.string().optional(),
    address: z.object({
        line1: z.string().min(1, 'Address is required'),
        line2: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
    }),
    status: z.enum(['ACTIVE', 'INACTIVE']),
})

export type CreateFormValues = z.infer<typeof createSchema>

export default function CreateUserRoute() {
    const navigate = useNavigate()
    const [stations, setStations] = useState<Station[]>([])

    useEffect(() => {
        void mockApi.listStations().then(setStations)
    }, [])

    const form = useForm({
        resolver: zodResolver(createSchema) as any,
        defaultValues: {
            name: '',
            mobile: '',
            email: '',
            gender: 'MALE',
            dob: '',
            role: 'CUSTOMER',
            status: 'ACTIVE',
            address: { line1: '', line2: '', city: '', state: '', postalCode: '' },
        },
    })

    const onSubmit = async (values: CreateFormValues) => {
        try {
            await mockApi.saveUser(values as unknown as User)
            toast.success('User created successfully')
            navigate('/users')
        } catch (error) {
            toast.error('Failed to create user')
        }
    }

    const stationOptions = stations.map((s) => ({ label: s.name, value: s.id }))

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/users')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Create User"
                    description="Onboard a new customer or employee"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Personal Information</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="name" label="Full Name" placeholder="John Doe" />
                                    <TextInputField control={form.control} name="email" label="Email Address" type="email" placeholder="john@example.com" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <TextInputField control={form.control} name="mobile" label="Mobile Number" placeholder="1234567890" />
                                    <SelectField
                                        control={form.control}
                                        name="gender"
                                        label="Gender"
                                        options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }, { label: 'Other', value: 'OTHER' }]}
                                    />
                                    <TextInputField control={form.control} name="dob" label="Date of Birth" type="date" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">System Access & Role</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <SelectField
                                        control={form.control}
                                        name="role"
                                        label="System Role"
                                        options={userRoleOptions.map(r => ({ label: r.replace(/_/g, ' '), value: r }))}
                                    />
                                    {form.watch('role') !== 'CUSTOMER' && (
                                        <SelectField
                                            control={form.control}
                                            name="stationId"
                                            label="Assigned Station"
                                            options={stationOptions}
                                        />
                                    )}
                                </div>
                                <div className="max-w-xs">
                                    <SelectField
                                        control={form.control}
                                        name="status"
                                        label="Account Status"
                                        options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Address Details</h4>
                                <TextInputField control={form.control} name="address.line1" label="Address Line 1" placeholder="123 Main St" />
                                <TextInputField control={form.control} name="address.line2" label="Address Line 2 (Optional)" placeholder="Apt 4B" />
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <TextInputField control={form.control} name="address.city" label="City" placeholder="City" />
                                    <TextInputField control={form.control} name="address.state" label="State" placeholder="State" />
                                    <TextInputField control={form.control} name="address.postalCode" label="Postal Code" placeholder="ZIP" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/users')}>Cancel</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">
                                    Create User
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
