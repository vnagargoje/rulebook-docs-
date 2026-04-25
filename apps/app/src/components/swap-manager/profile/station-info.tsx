import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View, Text } from '@/components/ui'
import { useManagerSwapStation } from '@/queries/swap-manager/swap-station.query'
import { useIsAuthenticated } from '@/queries/auth.query'

export function StationDetailsSection() {
    const { data } = useIsAuthenticated()
    const {
        data: station,
        isLoading,
        isError,
    } = useManagerSwapStation({ variables: { managerId: data?.userId ?? '' } })

    if (isLoading) {
        return (
            <View className='rounded-3xl border border-neutral-200 bg-white p-4'>
                <Text className='px-1 text-xs font-bold uppercase tracking-[1.2px] text-neutral-400'>My Station</Text>
                <View className='mt-3 items-center py-6'>
                    <Text className='text-sm text-neutral-400'>Loading station details...</Text>
                </View>
            </View>
        )
    }

    if (isError || !station) {
        return (
            <View className='rounded-3xl border border-neutral-200 bg-white p-4'>
                <Text className='px-1 text-xs font-bold uppercase tracking-[1.2px] text-neutral-400'>My Station</Text>
                <View className='mt-3 items-center py-6'>
                    <Text className='text-sm text-neutral-400'>No station assigned</Text>
                </View>
            </View>
        )
    }

    const addressLine = [
        station.address?.lineOne,
        station.address?.lineTwo,
        station.address?.city?.name,
        station.address?.city?.state?.name,
        station.address?.pincode,
    ]
        .filter(Boolean)
        .join(', ')

    return (
        <View className='rounded-3xl border border-neutral-200 bg-white p-4'>
            <Text className='px-1 text-xs font-bold uppercase tracking-[1.2px] text-neutral-400'>My Station</Text>
            <View className='mt-3'>
                <View className='flex-row items-center py-3.5 px-1'>
                    <View className='h-10 w-10 rounded-xl bg-cyan-50 items-center justify-center'>
                        <MaterialCommunityIcons
                            name='ev-station'
                            size={20}
                            color='#0891B2'
                        />
                    </View>
                    <View className='ml-3 flex-1'>
                        <Text className='text-sm font-semibold text-neutral-900'>Station Name</Text>
                        <Text className='text-xs text-neutral-500 mt-0.5'>{station.name}</Text>
                    </View>
                    <View className={`rounded-full px-2.5 py-1 ${station.active ? 'bg-success-500/15' : 'bg-red-50'}`}>
                        <Text className={`text-xs font-bold ${station.active ? 'text-success-600' : 'text-red-500'}`}>
                            {station.active ? 'Active' : 'Inactive'}
                        </Text>
                    </View>
                </View>

                <View className='ml-14 border-b border-neutral-100' />

                <View className='flex-row items-center py-3.5 px-1'>
                    <View className='h-10 w-10 rounded-xl bg-violet-50 items-center justify-center'>
                        <MaterialCommunityIcons
                            name='tag-outline'
                            size={20}
                            color='#7C3AED'
                        />
                    </View>
                    <View className='ml-3 flex-1'>
                        <Text className='text-sm font-semibold text-neutral-900'>Type</Text>
                        <Text className='text-xs text-neutral-500 mt-0.5'>
                            {station.type === 'swap_station' ? 'Swap Station' : 'Hub Station'}
                        </Text>
                    </View>
                </View>

                {addressLine ? (
                    <>
                        <View className='ml-14 border-b border-neutral-100' />
                        <View className='flex-row items-center py-3.5 px-1'>
                            <View className='h-10 w-10 rounded-xl bg-emerald-50 items-center justify-center'>
                                <MaterialCommunityIcons
                                    name='map-marker-outline'
                                    size={20}
                                    color='#059669'
                                />
                            </View>
                            <View className='ml-3 flex-1'>
                                <Text className='text-sm font-semibold text-neutral-900'>Address</Text>
                                <Text className='text-xs text-neutral-500 mt-0.5 leading-4'>{addressLine}</Text>
                            </View>
                        </View>
                    </>
                ) : null}

                {station.latitude != null && station.longitude != null ? (
                    <>
                        <View className='ml-14 border-b border-neutral-100' />
                        <View className='flex-row items-center py-3.5 px-1'>
                            <View className='h-10 w-10 rounded-xl bg-sky-50 items-center justify-center'>
                                <MaterialCommunityIcons
                                    name='crosshairs-gps'
                                    size={20}
                                    color='#0284C7'
                                />
                            </View>
                            <View className='ml-3 flex-1'>
                                <Text className='text-sm font-semibold text-neutral-900'>Coordinates</Text>
                                <Text className='text-xs text-neutral-500 mt-0.5'>
                                    {Number(station.latitude).toFixed(5)}, {Number(station.longitude).toFixed(5)}
                                </Text>
                            </View>
                        </View>
                    </>
                ) : null}
            </View>
        </View>
    )
}
