import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'

import { CheckboxField, SelectField, TextInputField } from '~/components/forms/controlled-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { useCreateBattery } from '~/queries/batteries'
import { useStations } from '~/queries/stations'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { createBatterySchema, type CreateBatteryFormValues } from '~/schemas'

export default function CreateBatteryRoute() {
    const navigate = useNavigate()
    const createBattery = useCreateBattery()
    const { data: stations } = useStations({ limit: 100 })

    const form = useForm<CreateBatteryFormValues>({
        resolver: zodResolver(createBatterySchema),
        defaultValues: {
            batteryCode: '',
            gpsId: '',
            capacity: '',
            range: '',
            lifecycle: '',
            chargingTime: '',
            weight: '',
            mfgDate: '',
            warranty: '',
            removable: true,
            stationId: '',
        },
    })

    const stationOptions = useMemo(
        () =>
            (stations?.data ?? []).map((s) => ({
                label: s.name,
                value: s.id,
            })),
        [stations?.data],
    )

    const onSubmit = useCallback(
        (values: CreateBatteryFormValues) => {
            createBattery.mutate(
                {
                    batteryQrId: values.batteryCode,
                    gpsId: values.gpsId || undefined,
                    stationId: values.stationId || undefined,
                    properties: {
                        capacity: values.capacity || undefined,
                        range: values.range || undefined,
                        lifecycle: values.lifecycle || undefined,
                        chargingTime: values.chargingTime || undefined,
                        weight: values.weight || undefined,
                        mfgDate: values.mfgDate || undefined,
                        warranty: values.warranty || undefined,
                        removableOption: values.removable,
                    },
                },
                {
                    onSuccess: () => {
                        toast.success('Battery added successfully')
                        navigate('/batteries')
                    },
                    onError: (error: any) => {
                        toast.error(error?.response?.data?.message || 'Failed to save battery')
                    },
                },
            )
        },
        [createBattery, navigate],
    )

    return (
        <div className='space-y-6 max-w-4xl mx-auto pb-12'>
            <div className='flex items-center gap-4'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => navigate('/batteries')}
                    className='shrink-0'>
                    <IconArrowLeft size={20} />
                </Button>
                <PageHeader
                    title='Register New Battery'
                    description='Add a new battery to the inventory pool'
                />
            </div>

            <Card className='border-border/40 shadow-sm bg-white overflow-hidden'>
                <CardContent className='p-8'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6'>
                            <div className='grid grid-cols-2 gap-6'>
                                <TextInputField
                                    control={form.control}
                                    name='batteryCode'
                                    label='Battery Code'
                                    placeholder='BAT-XX-123'
                                />
                                <TextInputField
                                    control={form.control}
                                    name='gpsId'
                                    label='GPS Tracker ID'
                                    placeholder='GPS-445'
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-6'>
                                <TextInputField
                                    control={form.control}
                                    name='capacity'
                                    label='Capacity (Ah)'
                                    placeholder='e.g. 40'
                                />
                                <TextInputField
                                    control={form.control}
                                    name='range'
                                    label='Range (km)'
                                    placeholder='e.g. 80'
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-6'>
                                <TextInputField
                                    control={form.control}
                                    name='lifecycle'
                                    label='Lifecycle Count'
                                    placeholder='e.g. 500'
                                />
                                <TextInputField
                                    control={form.control}
                                    name='chargingTime'
                                    label='Charging Time (Hrs)'
                                    placeholder='e.g. 4'
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-6'>
                                <TextInputField
                                    control={form.control}
                                    name='weight'
                                    label='Weight (kg)'
                                    placeholder='e.g. 15'
                                />
                                <TextInputField
                                    control={form.control}
                                    name='mfgDate'
                                    label='Manufactured Date'
                                    type='date'
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-6'>
                                <TextInputField
                                    control={form.control}
                                    name='warranty'
                                    label='Warranty Until'
                                    type='date'
                                />
                                <SelectField
                                    control={form.control}
                                    name='stationId'
                                    label='Assigned Station (Optional)'
                                    options={stationOptions}
                                    placeholder='Select a station'
                                />
                            </div>

                            <CheckboxField
                                control={form.control}
                                name='removable'
                                label='Is Battery Removable?'
                            />

                            <div className='flex justify-end gap-3 pt-6 border-t mt-4'>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => navigate('/batteries')}>
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={createBattery.isPending}
                                    className='min-w-35 uppercase text-xs font-bold tracking-widest'>
                                    {createBattery.isPending ? 'Registering...' : 'Register Battery'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
