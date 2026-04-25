import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'

import { Text, View } from '@/components/ui'
import type { SMTransportVehicle } from '@/queries/swap-manager/battery-transport.query'

interface VehicleListItemProps {
    vehicle: SMTransportVehicle
    onSelect: (vehicle: SMTransportVehicle) => void
}

export function VehicleListItem({ vehicle, onSelect }: VehicleListItemProps) {
    return (
        <Pressable
            onPress={() => onSelect(vehicle)}
            className='mx-4 rounded-3xl border border-neutral-100 bg-white p-4 active:opacity-70'>
            <View className='flex-row items-center'>
                <View className='h-10 w-10 items-center justify-center rounded-2xl bg-amber-50'>
                    <MaterialCommunityIcons
                        name='truck-outline'
                        size={20}
                        color='#D97706'
                    />
                </View>
                <View className='ml-3 flex-1'>
                    <Text className='text-sm font-bold text-neutral-900'>{vehicle.vehicleNumber}</Text>
                    <Text className='mt-0.5 text-xs text-neutral-400'>Transport Vehicle</Text>
                </View>
                <MaterialCommunityIcons
                    name='chevron-right'
                    size={20}
                    color='#D1D5DB'
                />
            </View>
        </Pressable>
    )
}
