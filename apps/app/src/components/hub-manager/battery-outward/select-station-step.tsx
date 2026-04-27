import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ActivityIndicator, FlatList } from 'react-native'

import { Text, View } from '@/components/ui'
import type { SwapStation } from '@/queries/hub-manager/stations-vehicles.query'

import { StationListItem } from './station-list-item'

interface SelectStationStepProps {
    stations: SwapStation[]
    isLoading: boolean
    onSelect: (station: SwapStation) => void
}

export function SelectStationStep({ stations, isLoading, onSelect }: SelectStationStepProps) {
    return (
        <View className='flex-1'>
            <View className='px-4 py-4'>
                <Text className='text-base font-bold text-neutral-900'>Select Destination Station</Text>
                <Text className='mt-0.5 text-xs text-neutral-500'>
                    Choose the swap station you are dispatching batteries to
                </Text>
            </View>
            {isLoading ? (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator
                        size='large'
                        color='#059669'
                    />
                </View>
            ) : stations.length === 0 ? (
                <View className='flex-1 items-center justify-center px-8'>
                    <MaterialCommunityIcons
                        name='ev-station'
                        size={48}
                        color='#D1D5DB'
                    />
                    <Text className='mt-4 text-base font-semibold text-neutral-400'>No stations available</Text>
                    <Text className='mt-1 text-center text-sm text-neutral-400'>
                        There are no swap stations configured to receive batteries
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={stations}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <StationListItem
                            station={item}
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
