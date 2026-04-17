import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextAreaField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { mockApi } from '~/services/mockApi'
import { surrenderStatusOptions, type CustomerVehicleAssignment, type User, type Vehicle, type VehicleSurrender } from '~/types/admin'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'

const createSchema = z.object({
    vehicleId: z.string().min(1, 'Vehicle is required'),
    customerId: z.string().min(1, 'Customer is required'),
    remarks: z.string().min(1, 'Remarks are required'),
    penaltyCharges: z.coerce.number().min(0, 'Must be >= 0'),
    depositReturnAmount: z.coerce.number().min(0, 'Must be >= 0'),
    status: z.enum(['SUBMITTED', 'APPROVED', 'CLOSED']),
})

export type CreateSurrenderValues = z.infer<typeof createSchema>

export default function CreateSurrenderRoute() {
    const navigate = useNavigate()
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [assignments, setAssignments] = useState<CustomerVehicleAssignment[]>([])

    useEffect(() => {
        void Promise.all([
            mockApi.listVehicles(),
            mockApi.listUsers(),
            mockApi.listCustomerVehicleAssignments()
        ]).then(([v, u, a]) => {
            setVehicles(v)
            setUsers(u)
            setAssignments(a)
        })
    }, [])

    const form = useForm({
        resolver: zodResolver(createSchema) as any,
        defaultValues: {
            vehicleId: '',
            customerId: '',
            remarks: '',
            penaltyCharges: 0,
            depositReturnAmount: 0,
            status: 'SUBMITTED',
        },
    })

    // Auto-fetch customer when vehicle is selected
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'vehicleId' && value.vehicleId) {
                const assignment = assignments.find(a => a.vehicleId === value.vehicleId)
                if (assignment) {
                    form.setValue('customerId', assignment.customerId)
                }
            }
        })
        return () => subscription.unsubscribe()
    }, [form, assignments])

    const onSubmit = async (values: CreateSurrenderValues) => {
        try {
            await mockApi.saveSurrender(values as unknown as VehicleSurrender)
            toast.success('Vehicle surrender processed successfully')
            navigate('/surrender')
        } catch (error) {
            toast.error('Failed to process surrender')
        }
    }

    const getVehicleName = (id: string) => vehicles.find((v) => v.id === id)?.registrationNumber || id
    const vehicleOptions = assignments.map(a => ({ label: getVehicleName(a.vehicleId), value: a.vehicleId }))
    const customerOptions = users.map(u => ({ label: `${u.name} (${u.email})`, value: u.id }))

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/surrender')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Process Vehicle Return"
                    description="Handle vehicle surrenders, compute penalties and process deposit returns"
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <SelectField
                                control={form.control}
                                name="vehicleId"
                                label="Vehicle Returning"
                                placeholder="Select Assigned Vehicle"
                                options={vehicleOptions}
                            />

                            <SelectField
                                control={form.control}
                                name="customerId"
                                label="Customer (Resolved from Vehicle)"
                                placeholder="Awaiting Vehicle Selection"
                                options={customerOptions}
                                disabled
                            />

                            <TextAreaField control={form.control} name="remarks" label="Remarks / Damage Notes" placeholder="Detail any damages or notable conditions on return." />

                            <div className="grid grid-cols-2 gap-6">
                                <TextInputField control={form.control} name="penaltyCharges" label="Penalty/Charges (₹)" type="number" />
                                <TextInputField control={form.control} name="depositReturnAmount" label="Deposit Return (₹)" type="number" />
                            </div>

                            <SelectField
                                control={form.control}
                                name="status"
                                label="Closure Status"
                                options={surrenderStatusOptions.map(t => ({ label: t.replace(/_/g, ' '), value: t }))}
                            />

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/surrender')}>Cancel Workflow</Button>
                                <Button type="submit" className="min-w-[140px] uppercase text-xs font-bold tracking-widest">Process Surrender</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
