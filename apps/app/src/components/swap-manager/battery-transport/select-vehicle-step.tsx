import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ActivityIndicator, FlatList } from 'react-native'

import { Text, View } from '@/components/ui'
import type { SMHubStation, SMTransportVehicle } from '@/queries/swap-manager/battery-transport.query'
import { VehicleListItem } from './vehicle-list-item'



interface SelectVehicleStepProps {
    vehicles: SMTransportVehicle[]
    selectedHub: SMHubStation | null
    isLoading: boolean
    onSelect: (vehicle: SMTransportVehicle) => void
}

export function SelectVehicleStep({ vehicles, selectedHub, isLoading, onSelect }: SelectVehicleStepProps) {
    return (
        <View className='flex-1'>
            <View className='px-4 py-4'>
                <Text className='text-base font-bold text-neutral-900'>Select Transport Vehicle</Text>
                {selectedHub && (
                    <Text className='mt-0.5 text-xs text-neutral-500'>
                        Dispatching to: {selectedHub.name ?? selectedHub.id}
                    </Text>
                )}
            </View>
            {isLoading ? (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator
                        size='large'
                        color='#D97706'
                    />
                </View>
            ) : vehicles.length === 0 ? (
                <View className='flex-1 items-center justify-center px-8'>
                    <MaterialCommunityIcons
                        name='truck-outline'
                        size={48}
                        color='#D1D5DB'
                    />
                    <Text className='mt-4 text-base font-semibold text-neutral-400'>No vehicles available</Text>
                    <Text className='mt-1 text-center text-sm text-neutral-400'>
                        There are no transport vehicles available
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <VehicleListItem
                            vehicle={item}
                            onSelect={onSelect}
                        />
                    )}
                    contentContainerStyle={{ gap: 12, paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    )
}
