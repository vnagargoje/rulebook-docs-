import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable, ScrollView } from 'react-native'

import { Text, View } from '@/components/ui'
import type { Movement } from '@/queries/hub-manager/movements.query'

interface MovementListItemProps {
    movement: Movement
    onSelect: (movement: Movement) => void
}

export function MovementListItem({ movement, onSelect }: MovementListItemProps) {
    return (
        <Pressable
            onPress={() => onSelect(movement)}
            className='mx-4 rounded-3xl border border-neutral-100 bg-white p-4 active:opacity-70'>
            <View className='flex-row items-center justify-between'>
                <View className='flex-1'>
                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                        From Station
                    </Text>
                    <Text className='mt-0.5 text-base font-bold text-neutral-900'>
                        {movement.fromStation?.name ?? movement.fromStationId}
                    </Text>
                </View>
                <View className='ml-3 flex-row items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1'>
                    <View className='h-1.5 w-1.5 rounded-full bg-amber-400' />
                    <Text className='text-xs font-semibold text-amber-700'>In Transit</Text>
                </View>
            </View>
            <View className='mt-3 flex-row items-center justify-between border-t border-neutral-100 pt-3'>
                <View className='flex-row items-center gap-1.5'>
                    <MaterialCommunityIcons
                        name='truck-outline'
                        size={14}
                        color='#6B7280'
                    />
                    <Text className='text-xs text-neutral-500'>
                        {movement.vehicle?.vehicleNumber ?? 'Vehicle unknown'}
                    </Text>
                </View>
                <View className='flex-row items-center gap-1.5'>
                    <MaterialCommunityIcons
                        name='battery-outline'
                        size={14}
                        color='#6B7280'
                    />
                    <Text className='text-xs font-semibold text-neutral-700'>
                        {movement.batteryIds.length} batteries expected
                    </Text>
                </View>
            </View>
            {movement.batteryIds.length > 0 && (
                <View className='mt-3 border-t border-neutral-100 pt-3'>
                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400 mb-2'>
                        Battery IDs
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 6 }}>
                        {movement.batteryIds.map((id) => (
                            <View
                                key={id}
                                className='flex-row items-center gap-1 rounded-full bg-primary-50 border border-primary-100 px-2.5 py-1'>
                                <MaterialCommunityIcons
                                    name='battery-charging'
                                    size={11}
                                    color='#2563EB'
                                />
                                <Text className='text-[11px] font-semibold text-primary-700'>{id}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
            <View className='mt-2 flex-row items-center justify-end gap-1'>
                <Text className='text-xs text-primary-600 font-semibold'>Select</Text>
                <MaterialCommunityIcons
                    name='chevron-right'
                    size={14}
                    color='#2563EB'
                />
            </View>
        </Pressable>
    )
}
