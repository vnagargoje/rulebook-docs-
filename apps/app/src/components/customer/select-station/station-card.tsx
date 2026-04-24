import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Button, Text, View } from '@/components/ui'
import type { Station } from '@/queries/customer'

type Props = {
    station: Station
    isSelected: boolean
    onSelect: () => void
}

export function StationCard({ station, isSelected, onSelect }: Props) {
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

    return (
        <View
            className={`overflow-hidden rounded-3xl border-2 ${
                isSelected ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white'
            }`}>
            <View className='p-4'>
                <View className='flex-row items-start justify-between gap-3'>
                    <View className='flex-1'>
                        <View className='flex-row items-center gap-2'>
                            <View
                                className={`h-10 w-10 items-center justify-center rounded-xl ${
                                    isSelected ? 'bg-primary-100' : 'bg-neutral-100'
                                }`}>
                                <MaterialCommunityIcons
                                    name='map-marker'
                                    size={20}
                                    color={isSelected ? '#2563EB' : '#6B7280'}
                                />
                            </View>
                            <View className='flex-1'>
                                <Text className='text-base font-semibold text-neutral-900'>
                                    {station.name}
                                </Text>
                                {cityName ? (
                                    <Text className='text-xs text-neutral-500'>{cityName}</Text>
                                ) : null}
                            </View>
                        </View>
                        {addressLine ? (
                            <Text className='mt-3 text-sm leading-5 text-neutral-500'>{addressLine}</Text>
                        ) : null}
                    </View>
                    <View
                        className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                            isSelected ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 bg-white'
                        }`}>
                        {isSelected && <MaterialCommunityIcons name='check' size={14} color='#FFF' />}
                    </View>
                </View>

                <View className='mt-3 flex-row items-center gap-2'>
                    <View className='rounded-full bg-success-100 px-3 py-1'>
                        <Text className='text-xs font-semibold text-success-700'>
                            {station.active ? 'Open' : 'Closed'}
                        </Text>
                    </View>
                    <Text className='text-xs text-neutral-400'>
                        {station.type === 'hub_station' ? 'Hub Station' : 'Swap Station'}
                    </Text>
                </View>
            </View>

            {!isSelected && (
                <View className='border-t border-neutral-100 px-4 py-3'>
                    <Button
                        label='Select this station'
                        onPress={onSelect}
                        variant='outline'
                        className='h-10 rounded-xl border-neutral-200'
                        textClassName='text-sm font-medium text-neutral-700'
                    />
                </View>
            )}
        </View>
    )
}
