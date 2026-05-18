import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { CheckboxField, SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useGetUserById, useUpdateUser, useUpdateUserAddresses, type UpdateUserPayload } from '~/queries/users'
import { useStates, useCities } from '~/hooks'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { updateUserSchema, type UpdateUserFormValues } from '~/schemas'
import { employeeRoleOptions, genderOptions, allowedRoles, allowedGenders } from '~/constants'

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

function toDisplayMobileNumber(mobile?: string) {
    if (!mobile) return ''

    const normalizedMobile = mobile.trim()
    if (/^91\d{10}$/.test(normalizedMobile)) {
        return normalizedMobile.slice(2)
    }

    return normalizedMobile
}

export default function EditUserRoute() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { data: user, isLoading } = useGetUserById(id)
    const updateUser = useUpdateUser()
    const updateAddresses = useUpdateUserAddresses()
    const { data: states } = useStates()
    const isCustomerRoute = location.pathname.startsWith('/customers')
    const roleOptions = employeeRoleOptions
    const backPath = isCustomerRoute ? '/customers' : '/users'

    const form = useForm<UpdateUserFormValues>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            mobilenumber: '',
            email: '',
            gender: undefined,
            dateOfBirth: '',
            role: isCustomerRoute ? 'customer' : 'swap_manager',
            currentStateId: '',
            currentCityId: '',
            currentLineOne: '',
            currentLineTwo: '',
            currentPincode: '',
            sameAddress: false,
            permanentStateId: '',
            permanentCityId: '',
            permanentLineOne: '',
            permanentLineTwo: '',
            permanentPincode: '',
        },
    })

    const currentStateId = form.watch('currentStateId')
    const permanentStateId = form.watch('permanentStateId')
    const sameAddress = form.watch('sameAddress')

    const { data: currentCities } = useCities(currentStateId || undefined)
    const { data: permanentCities } = useCities(permanentStateId || undefined)

    const stateOptions = (states ?? []).map((s) => ({ label: s.name, value: s.id }))
    const currentCityOptions = (currentCities ?? []).map((c) => ({ label: c.name, value: c.id }))
    const permanentCityOptions = (permanentCities ?? []).map((c) => ({ label: c.name, value: c.id }))

    useEffect(() => {
        if (user) {
            const normalizedGender = getGenderValue(user.gender ?? undefined)
            const normalizedRole = getRoleNameFromProperties(user.properties) ?? ((user.roles?.[0]?.name?.trim().toLowerCase() as UpdateUserFormValues['role']) || 'customer')

            const currentAddr = user.addresses?.find((a) => a.type === 'current')
            const permanentAddr = user.addresses?.find((a) => a.type === 'permanent')

            const isSame =
                currentAddr &&
                permanentAddr &&
                currentAddr.lineOne === permanentAddr.lineOne &&
                currentAddr.pincode === permanentAddr.pincode &&
                currentAddr.city?.id === permanentAddr.city?.id

            form.reset({
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                mobilenumber: toDisplayMobileNumber(user.mobilenumber),
                email: user.email ?? '',
                gender: normalizedGender,
                dateOfBirth: user.dateOfBirth ?? '',
                role: isCustomerRoute ? 'customer' : normalizedRole,
                currentStateId: currentAddr?.city?.state?.id ?? '',
                currentCityId: currentAddr?.city?.id ?? '',
                currentLineOne: currentAddr?.lineOne ?? '',
                currentLineTwo: currentAddr?.lineTwo ?? '',
                currentPincode: currentAddr?.pincode ?? '',
                sameAddress: Boolean(isSame),
                permanentStateId: permanentAddr?.city?.state?.id ?? '',
                permanentCityId: permanentAddr?.city?.id ?? '',
                permanentLineOne: permanentAddr?.lineOne ?? '',
                permanentLineTwo: permanentAddr?.lineTwo ?? '',
                permanentPincode: permanentAddr?.pincode ?? '',
            })
        }
    }, [user, form, isCustomerRoute])

    const onSubmit = async (values: UpdateUserFormValues) => {
        if (!id || !user) return

        const mobile = values.mobilenumber.startsWith('91') ? values.mobilenumber : `91${values.mobilenumber}`
        const existingProperties = user.properties && typeof user.properties === 'object' ? user.properties : {}
        const role = isCustomerRoute ? 'customer' : values.role
        const payload: UpdateUserPayload = {
            firstName: values.firstName,
            lastName: values.lastName,
            mobilenumber: mobile,
            email: values.email || undefined,
            gender: values.gender,
            dateOfBirth: values.dateOfBirth || undefined,
            role,
            properties: {
                ...existingProperties,
                roleName: role,
            },
        }

        const permanentAddr = values.permanentLineOne?.trim()
            ? {
                  lineOne: values.permanentLineOne,
                  lineTwo: values.permanentLineTwo || undefined,
                  pincode: values.permanentPincode || '',
                  cityId: values.permanentCityId || undefined,
              }
            : undefined

        const currentAddr = values.sameAddress
            ? permanentAddr
            : values.currentLineOne?.trim()
                ? {
                      lineOne: values.currentLineOne,
                      lineTwo: values.currentLineTwo || undefined,
                      pincode: values.currentPincode || '',
                      cityId: values.currentCityId || undefined,
                  }
                : undefined

        if (permanentAddr || currentAddr) {

            try {
                await Promise.all([
                    updateUser.mutateAsync({ id, data: payload }),
                    updateAddresses.mutateAsync({
                        id,
                        data: { current: currentAddr, permanent: permanentAddr },
                    }),
                ])
                toast.success('User updated successfully')
                navigate(backPath)
            } catch (error: any) {
                toast.error(error?.response?.data?.message || 'Failed to update user')
            }
        } else {
            updateUser.mutate(
                { id, data: payload },
                {
                    onSuccess: () => {
                        toast.success('User updated successfully')
                        navigate(backPath)
                    },
                    onError: (error: any) => {
                        toast.error(error?.response?.data?.message || 'Failed to update user')
                    },
                },
            )
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse font-bold tracking-widest text-sm uppercase">Loading Record...</div>
    }

    if (!user) {
        return <div className="p-8 text-center text-muted-foreground font-bold tracking-widest text-sm uppercase">User not found</div>
    }

    const isPending = updateUser.isPending || updateAddresses.isPending

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(backPath)} className="shrink-0">
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title={isCustomerRoute ? 'Update Customer' : 'Update Employee'}
                    description={isCustomerRoute ? 'Modify customer profile information' : 'Modify employee profile and system access'}
                />
            </div>

            <Card className="border-border/40 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Personal Information */}
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
                                    <SelectField control={form.control} name="gender" label="Gender" options={[...genderOptions]} />
                                    <TextInputField control={form.control} name="dateOfBirth" label="Date of Birth" type="date" />
                                </div>
                            </div>

                            {/* Current Address */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Permanent Address</h4>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TextInputField control={form.control} name="permanentLineOne" label="Address Line 1" placeholder="Building, Street, Landmark" />
                                    <TextInputField control={form.control} name="permanentLineTwo" label="Address Line 2 (Optional)" placeholder="Additional details" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <SelectField
                                        control={form.control}
                                        name="permanentStateId"
                                        label="State"
                                        options={stateOptions}
                                        placeholder="Select state"
                                    />
                                    <SelectField
                                        control={form.control}
                                        name="permanentCityId"
                                        label="City"
                                        options={permanentCityOptions}
                                        placeholder={permanentStateId ? 'Select city' : 'Select state first'}
                                        key={permanentStateId || 'no-perm-state'}
                                    />
                                    <TextInputField control={form.control} name="permanentPincode" label="PIN Code" placeholder="400001" />
                                </div>
                            </div>

                            {/* Current Address */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Current Address</h4>
                                <CheckboxField
                                    control={form.control}
                                    name="sameAddress"
                                    label="Same as permanent address"
                                />
                                {!sameAddress && (
                                    <>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <TextInputField control={form.control} name="currentLineOne" label="Address Line 1" placeholder="Building, Street, Landmark" />
                                            <TextInputField control={form.control} name="currentLineTwo" label="Address Line 2 (Optional)" placeholder="Additional details" />
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                            <SelectField
                                                control={form.control}
                                                name="currentStateId"
                                                label="State"
                                                options={stateOptions}
                                                placeholder="Select state"
                                            />
                                            <SelectField
                                                control={form.control}
                                                name="currentCityId"
                                                label="City"
                                                options={currentCityOptions}
                                                placeholder={currentStateId ? 'Select city' : 'Select state first'}
                                                key={currentStateId || 'no-state'}
                                            />
                                            <TextInputField control={form.control} name="currentPincode" label="PIN Code" placeholder="400001" />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* System Access */}
                            {!isCustomerRoute && (
                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">System Access & Role</h4>
                                    <div className="max-w-xs">
                                        <SelectField control={form.control} name="role" label="System Role" options={[...roleOptions]} />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate(backPath)}>Cancel</Button>
                                <Button type="submit" disabled={isPending} className="min-w-35 uppercase text-xs font-bold tracking-widest">
                                    {isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
