import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Pressable, Text, View } from '@/components/ui'
import type { Station } from '@/queries/customer'

type Props = {
    station: Station
    onPress: () => void
}

export function SwapStationCard({ station, onPress }: Props) {
    const cityName = station.address?.city?.name
    const stateName = station.address?.city?.state?.name
    const addressLine = station.address
        ? [
              station.address.lineOne,
              station.address.lineTwo,
              cityName,
              stateName,
              station.address.pincode,
          ]
              .filter(Boolean)
              .join(', ')
        : null

    const managerName = station.manager
        ? [station.manager.firstName, station.manager.lastName].filter(Boolean).join(' ') ||
          station.manager.mobilenumber ||
          null
        : null

    return (
        <Pressable onPress={onPress}>
        <View className='overflow-hidden rounded-3xl border border-neutral-200 bg-white'>
            <View className='p-4'>
                <View className='flex-row items-start gap-3'>
                    <View className='h-12 w-12 items-center justify-center rounded-2xl bg-primary-50'>
                        <MaterialCommunityIcons name='lightning-bolt' size={22} color='#2563EB' />
                    </View>
                    <View className='flex-1'>
                        <Text className='text-base font-bold text-neutral-900'>{station.name}</Text>
                        {cityName ? (
                            <Text className='mt-0.5 text-xs font-medium text-neutral-500'>
                                {cityName}
                                {stateName ? `, ${stateName}` : ''}
                            </Text>
                        ) : null}
                    </View>
                    <View
                        className={`rounded-full px-3 py-1 ${
                            station.active ? 'bg-success-100' : 'bg-neutral-100'
                        }`}>
                        <Text
                            className={`text-xs font-semibold ${
                                station.active ? 'text-success-700' : 'text-neutral-500'
                            }`}>
                            {station.active ? 'Open' : 'Closed'}
                        </Text>
                    </View>
                </View>

                {addressLine ? (
                    <View className='mt-3 flex-row items-start gap-2'>
                        <MaterialCommunityIcons
                            name='map-marker-outline'
                            size={14}
                            color='#9CA3AF'
                            style={{ marginTop: 2 }}
                        />
                        <Text className='flex-1 text-sm leading-5 text-neutral-500'>{addressLine}</Text>
                    </View>
                ) : null}

                <View className='mt-3 flex-row items-center gap-2'>
                    <View className='rounded-full bg-primary-50 px-3 py-1'>
                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-primary-600'>
                            Swap Station
                        </Text>
                    </View>
                    {managerName ? (
                        <Text className='text-xs text-neutral-400'>Manager: {managerName}</Text>
                    ) : null}
                </View>
            </View>
        </View>
        </Pressable>
    )
}
