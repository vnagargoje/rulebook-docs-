import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useCreateUser, type CreateUserPayload } from '~/queries/users'
import { useStates, useCities } from '~/hooks'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { createUserSchema, type CreateUserFormValues } from '~/schemas'
import { customerRoleOptions, filteredEmployeeRoles, genderOptions } from '~/constants'

export default function CreateUserRoute() {
    const navigate = useNavigate()
    const location = useLocation()
    const createUser = useCreateUser()
    const { data: states } = useStates()
    const isCustomerRoute = location.pathname.startsWith('/customers')
    const roleOptions = isCustomerRoute ? customerRoleOptions : filteredEmployeeRoles
    const defaultRole: CreateUserFormValues['role'] = isCustomerRoute ? 'customer' : 'swap_manager'
    const backPath = isCustomerRoute ? '/customers' : '/users'

    const form = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            mobilenumber: '',
            email: '',
            gender: undefined,
            dateOfBirth: '',
            role: defaultRole,
            stateId: '',
            cityId: '',
            lineOne: '',
            lineTwo: '',
            pincode: '',
        },
    })

    const selectedStateId = form.watch('stateId')
    const { data: cities } = useCities(selectedStateId || undefined)

    // Reset city when state changes
    useEffect(() => {
        form.setValue('cityId', '')
    }, [selectedStateId, form])

    useEffect(() => {
        if (isCustomerRoute) {
            form.setValue('role', 'customer')
        }
    }, [form, isCustomerRoute])

    const stateOptions = (states ?? []).map((s) => ({ label: s.name, value: s.id }))
    const cityOptions = (cities ?? []).map((c) => ({ label: c.name, value: c.id }))

    const onSubmit = (values: CreateUserFormValues) => {
        const mobile = values.mobilenumber.startsWith('91') ? values.mobilenumber : `91${values.mobilenumber}`
        const role = isCustomerRoute ? 'customer' : values.role
        const payload: CreateUserPayload = {
            mobilenumber: mobile,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email || undefined,
            gender: values.gender,
            dateOfBirth: values.dateOfBirth || undefined,
            role,
            properties: {
                roleName: role,
            },
        }

        if (values.lineOne) {
            payload.address = {
                lineOne: values.lineOne,
                lineTwo: values.lineTwo || undefined,
                pincode: values.pincode || '',
                cityId: values.cityId || undefined,
            }
        }

        createUser.mutate(payload, {
            onSuccess: () => {
                toast.success('User created successfully')
                navigate(backPath)
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to create user')
            },
        })
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(backPath)} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title={isCustomerRoute ? 'Create Customer' : 'Create Employee'}
                    description={isCustomerRoute ? 'Onboard a new customer account' : 'Onboard a new employee account'}
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Personal Information</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="firstName" label="First Name" placeholder="John" />
                                    <TextInputField control={form.control} name="lastName" label="Last Name" placeholder="Doe" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="email" label="Email Address" type="email" placeholder="john@example.com" />
                                    <TextInputField control={form.control} name="mobilenumber" label="Mobile Number" placeholder="9876543210" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <SelectField
                                        control={form.control}
                                        name="gender"
                                        label="Gender"
                                        options={[...genderOptions]}
                                    />
                                    <TextInputField control={form.control} name="dateOfBirth" label="Date of Birth" type="date" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Address</h4>
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

                            {!isCustomerRoute && (
                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">System Access & Role</h4>
                                    <div className="max-w-xs">
                                        <SelectField
                                            control={form.control}
                                            name="role"
                                            label="System Role"
                                            options={[...roleOptions]}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate(backPath)}>Cancel</Button>
                                <Button type="submit" disabled={createUser.isPending} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {createUser.isPending ? 'Creating...' : isCustomerRoute ? 'Create Customer' : 'Create Employee'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
