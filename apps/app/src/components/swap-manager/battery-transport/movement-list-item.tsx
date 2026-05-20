import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable, ScrollView } from 'react-native'

import { Text, View } from '@/components/ui'
import { BatteryQrChip } from '@/components/shared/battery-qr-chip'
import type { SMMovement } from '@/queries/swap-manager/battery-transport.query'

interface MovementListItemProps {
    movement: SMMovement
    onSelect: (movement: SMMovement) => void
}

export function MovementListItem({ movement, onSelect }: MovementListItemProps) {
    return (
        <Pressable
            onPress={() => onSelect(movement)}
            className='mx-4 rounded-3xl border border-neutral-100 bg-white p-4 active:opacity-70'>
            <View className='flex-row items-start'>
                <View className='h-10 w-10 items-center justify-center rounded-2xl bg-amber-50'>
                    <MaterialCommunityIcons
                        name='battery-arrow-down-outline'
                        size={20}
                        color='#D97706'
                    />
                </View>
                <View className='ml-3 flex-1'>
                    <View className='flex-row items-center justify-between'>
                        <Text className='text-sm font-bold text-neutral-900'>
                            {movement.fromStation?.name ?? movement.fromStationId}
                        </Text>
                        <View className='rounded-full bg-amber-100 px-2.5 py-0.5'>
                            <Text className='text-xs font-semibold text-amber-600'>In Transit</Text>
                        </View>
                    </View>
                    <Text className='mt-0.5 text-xs text-neutral-500'>
                        Vehicle: {movement.vehicle?.vehicleNumber ?? 'Unknown'}
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className='mt-2'
                        contentContainerStyle={{ gap: 6 }}>
                        {movement.batteryIds.map((id) => (
                            <BatteryQrChip key={id} batteryId={id} />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Pressable>
    )
}
