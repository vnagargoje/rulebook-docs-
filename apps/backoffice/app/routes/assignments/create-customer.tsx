import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import type { User, Vehicle } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const customerAssignmentSchema = z.object({
    vehicleId: z.string().min(1, 'Vehicle is required'),
    customerId: z.string().min(1, 'Customer is required'),
})

export default function CreateCustomerAssignmentRoute() {
    const navigate = useNavigate()
    const { customerId } = useParams()
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        void Promise.all([
            mockApi.listVehicles(),
            mockApi.listUsers()
        ]).then(([v, u]) => {
            setVehicles(v)
            setUsers(u)
        })
    }, [])

    const form = useForm({
        resolver: zodResolver(customerAssignmentSchema) as any,
        defaultValues: { vehicleId: '', customerId: customerId || '' },
    })

    const onSubmit = async (values: z.infer<typeof customerAssignmentSchema>) => {
        try {
            await mockApi.assignVehicleToCustomer(values)
            toast.success('Vehicle assigned to customer')
            navigate('/assignments')
        } catch (error) {
            toast.error('Failed to assign vehicle')
        }
    }

    const unassignedVehicles = vehicles.filter(v => v.status === 'AVAILABLE')
    const vehicleOptions = unassignedVehicles.map(v => ({ label: v.registrationNumber, value: v.id }))
    const customerOptions = users.map(c => ({ label: `${c.name} (${c.email})`, value: c.id }))

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/assignments')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Customer Assignment"
                    description="Fulfill a booking request or assign an available vehicle to a customer"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            
                            <SelectField
                                control={form.control}
                                name="vehicleId"
                                label="Available Vehicle"
                                placeholder="Select Vehicle"
                                options={vehicleOptions}
                            />

                            <SelectField
                                control={form.control}
                                name="customerId"
                                label="Customer"
                                placeholder="Select Customer"
                                options={customerOptions}
                            />

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/assignments')}>Cancel</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">Assign Customer</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
