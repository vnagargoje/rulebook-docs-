import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useGetUserById, useUpdateUser, type UpdateUserPayload } from '~/queries/users'
import { useStates, useCities } from '~/hooks'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { updateUserSchema, type UpdateUserFormValues } from '~/schemas'
import { roleOptions, genderOptions, allowedRoles, allowedGenders } from '~/constants'

function getUserProperties(properties: unknown) {
    if (!properties) return {}

    if (typeof properties === 'string') {
        try {
            const parsed = JSON.parse(properties)
            return parsed && typeof parsed === 'object' ? parsed : {}
        } catch {
            return {}
        }
    }

    return typeof properties === 'object' ? properties : {}
}

function getRoleNameFromProperties(properties: unknown): UpdateUserFormValues['role'] {
    const normalizedProperties = getUserProperties(properties) as { roleName?: string }
    const roleName = normalizedProperties.roleName?.trim().toLowerCase()

    return allowedRoles.find((value) => value === roleName) ?? 'customer'
}

function getGenderValue(gender?: string) {
    const normalizedGender = gender?.trim().toLowerCase()
    return normalizedGender ? allowedGenders.find((value) => value === normalizedGender) : undefined
}

export default function EditUserRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: user, isLoading } = useGetUserById(id)
    const updateUser = useUpdateUser()
    const { data: states } = useStates()

    const form = useForm<UpdateUserFormValues>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            mobilenumber: '',
            email: '',
            gender: undefined,
            dateOfBirth: '',
            role: 'customer',
            stateId: '',
            cityId: '',
            lineOne: '',
            lineTwo: '',
            pincode: '',
        },
    })

    const selectedStateId = form.watch('stateId')
    const { data: cities } = useCities(selectedStateId || undefined)

    const stateOptions = (states ?? []).map((s) => ({ label: s.name, value: s.id }))
    const cityOptions = (cities ?? []).map((c) => ({ label: c.name, value: c.id }))

    useEffect(() => {
        if (user) {
            const normalizedGender = getGenderValue(user.gender ?? undefined)
            const normalizedRole = getRoleNameFromProperties(user.properties) ?? ((user.roles?.[0]?.name?.trim().toLowerCase() as UpdateUserFormValues['role']) || 'customer')

            const address = user.addresses?.[0]
            form.reset({
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                mobilenumber: user.mobilenumber ?? '',
                email: user.email ?? '',
                gender: normalizedGender,
                dateOfBirth: user.dateOfBirth ?? '',
                role: normalizedRole,
                stateId: address?.city?.state?.id ?? '',
                cityId: address?.city?.id ?? '',
                lineOne: address?.lineOne ?? '',
                lineTwo: address?.lineTwo ?? '',
                pincode: address?.pincode ?? '',
            })
        }
    }, [user, form])

    const onSubmit = (values: UpdateUserFormValues) => {
        if (!id || !user) return

        const mobile = values.mobilenumber.startsWith('91') ? values.mobilenumber : `91${values.mobilenumber}`
        const existingProperties = user.properties && typeof user.properties === 'object' ? user.properties : {}
        const payload: UpdateUserPayload = {
            firstName: values.firstName,
            lastName: values.lastName,
            mobilenumber: mobile,
            email: values.email || undefined,
            gender: values.gender,
            dateOfBirth: values.dateOfBirth || undefined,
            role: values.role,
            properties: {
                ...existingProperties,
                roleName: values.role,
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

        updateUser.mutate(
            { id, data: payload },
            {
                onSuccess: () => {
                    toast.success('User updated successfully')
                    navigate('/users')
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'Failed to update user')
                },
            },
        )
    }

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
    }

    if (!user) {
        return <div className="p-8 text-center text-muted-foreground font-bold tracking-widest text-sm uppercase">User not found</div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/users')} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Update User"
                    description="Modify user profile and system access"
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

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/users')}>Cancel</Button>
                                <Button type="submit" disabled={updateUser.isPending} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {updateUser.isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
