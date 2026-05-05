import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { SearchSelectField, SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useCreateStation, type CreateStationPayload } from '~/queries/stations'
import { useInfiniteUsers } from '~/queries/users'
import { useStates, useCities } from '~/hooks'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { createStationSchema, type CreateStationFormValues } from '~/schemas'
import { stationManagerRoleByType, stationTypeOptions } from '~/constants'

export default function CreateStationRoute() {
    const navigate = useNavigate()
    const createStation = useCreateStation()
    const { data: states } = useStates()
    const previousTypeRef = useRef<CreateStationFormValues['type'] | undefined>(undefined)
    const [managerSearchQuery, setManagerSearchQuery] = useState('')

    const form = useForm<CreateStationFormValues>({
        resolver: zodResolver(createStationSchema),
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

    const selectedType = form.watch('type')
    const selectedStateId = form.watch('stateId')
    const deferredManagerSearchQuery = useDeferredValue(managerSearchQuery.trim())
    const managerRole = stationManagerRoleByType[selectedType] ?? ''
    const managerQueryParams = useMemo(
        () => ({
            limit: 25,
            'filter.roles.name': [`$eq:${managerRole}`],
            ...(deferredManagerSearchQuery ? { search: deferredManagerSearchQuery } : {}),
        }),
        [deferredManagerSearchQuery, managerRole],
    )
    const {
        data: managers,
        fetchNextPage: fetchNextManagersPage,
        hasNextPage: hasNextManagersPage,
        isFetchingNextPage: isFetchingNextManagersPage,
        isLoading: isLoadingManagers,
    } = useInfiniteUsers(managerQueryParams)
    const { data: cities } = useCities(selectedStateId || undefined)

    useEffect(() => {
        form.setValue('cityId', '')
    }, [selectedStateId, form])

    useEffect(() => {
        if (previousTypeRef.current !== undefined && previousTypeRef.current !== selectedType) {
            form.setValue('managerId', '')
        }

        previousTypeRef.current = selectedType
    }, [selectedType, form])

    useEffect(() => {
        setManagerSearchQuery('')
    }, [managerRole])

    const managerOptions = useMemo(() => {
        const allManagers = managers?.pages.flatMap((page) => page.data) ?? []

        return allManagers.map((u) => ({
            label: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || u.mobilenumber || u.id,
            value: u.id,
        }))
    }, [managers])
    const stateOptions = useMemo(() => (states ?? []).map((s) => ({ label: s.name, value: s.id })), [states])
    const cityOptions = useMemo(() => (cities ?? []).map((c) => ({ label: c.name, value: c.id })), [cities])
    const handleManagerSearchChange = useCallback((value: string) => {
        setManagerSearchQuery(value)
    }, [])
    const handleLoadMoreManagers = useCallback(() => {
        if (hasNextManagersPage && !isFetchingNextManagersPage) {
            void fetchNextManagersPage()
        }
    }, [fetchNextManagersPage, hasNextManagersPage, isFetchingNextManagersPage])

    const onSubmit = useCallback(
        (values: CreateStationFormValues) => {
            const payload: CreateStationPayload = {
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

            createStation.mutate(payload, {
                onSuccess: () => {
                    toast.success('Station created successfully')
                    navigate('/stations')
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'Failed to create station')
                },
            })
        },
        [createStation, navigate],
    )

    return (
        <div className='space-y-6 max-w-4xl mx-auto pb-12'>
            <div className='flex items-center gap-4'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => navigate('/stations')}
                    className='shrink-0'>
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title='Create New Station'
                    description='Register a new hub or swap station in the network'
                />
            </div>

            <Card className='border-border/40 shadow-sm bg-white overflow-hidden'>
                <CardContent className='p-8'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-8'>
                            <div className='space-y-6'>
                                <h4 className='text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2'>
                                    Identity & Classification
                                </h4>
                                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                                    <TextInputField
                                        control={form.control}
                                        name='name'
                                        label='Station Name'
                                        placeholder='e.g. Bandra West Hub'
                                    />
                                    <SelectField
                                        control={form.control}
                                        name='type'
                                        label='Facility Type'
                                        options={[...stationTypeOptions]}
                                    />
                                </div>
                                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                                    <SelectField
                                        control={form.control}
                                        name='active'
                                        label='Operational Status'
                                        options={[
                                            { label: 'Active', value: 'true' },
                                            { label: 'Inactive', value: 'false' },
                                        ]}
                                    />
                                    <SearchSelectField
                                        control={form.control}
                                        name='managerId'
                                        label='Station Manager (Optional)'
                                        options={managerOptions}
                                        placeholder='Select a manager'
                                        searchPlaceholder='Search station managers...'
                                        searchValue={managerSearchQuery}
                                        onSearchChange={handleManagerSearchChange}
                                        onLoadMore={handleLoadMoreManagers}
                                        hasMore={Boolean(hasNextManagersPage)}
                                        isLoadingOptions={isLoadingManagers}
                                        isLoadingMore={isFetchingNextManagersPage}
                                    />
                                </div>
                            </div>

                            <div className='space-y-6'>
                                <h4 className='text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2'>
                                    Geospatial Info
                                </h4>
                                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                                    <TextInputField
                                        control={form.control}
                                        name='latitude'
                                        label='Latitude Coordinate'
                                        placeholder='19.0760'
                                    />
                                    <TextInputField
                                        control={form.control}
                                        name='longitude'
                                        label='Longitude Coordinate'
                                        placeholder='72.8777'
                                    />
                                </div>
                            </div>

                            <div className='space-y-6'>
                                <h4 className='text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2'>
                                    Physical Location
                                </h4>
                                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                                    <TextInputField
                                        control={form.control}
                                        name='lineOne'
                                        label='Address Line 1'
                                        placeholder='Building, Street, Landmark'
                                    />
                                    <TextInputField
                                        control={form.control}
                                        name='lineTwo'
                                        label='Address Line 2 (Optional)'
                                        placeholder='Additional details'
                                    />
                                </div>
                                <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
                                    <SelectField
                                        control={form.control}
                                        name='stateId'
                                        label='State'
                                        options={stateOptions}
                                        placeholder='Select state'
                                    />
                                    <SelectField
                                        control={form.control}
                                        name='cityId'
                                        label='City'
                                        options={cityOptions}
                                        placeholder={selectedStateId ? 'Select city' : 'Select state first'}
                                        key={selectedStateId || 'no-state'}
                                    />
                                    <TextInputField
                                        control={form.control}
                                        name='pincode'
                                        label='PIN Code'
                                        placeholder='400001'
                                    />
                                </div>
                            </div>

                            <div className='flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4'>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => navigate('/stations')}>
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={createStation.isPending}
                                    className='min-w-35 uppercase text-xs font-bold tracking-widest'>
                                    {createStation.isPending ? 'Creating...' : 'Register Station'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
