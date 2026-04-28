import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ActivityIndicator, FlatList } from 'react-native'

import { Text, View } from '@/components/ui'
import type { SMHubStation } from '@/queries/swap-manager/battery-transport.query'

import { HubStationListItem } from './hub-station-list-item'

interface SelectHubStepProps {
    stations: SMHubStation[]
    isLoading: boolean
    onSelect: (station: SMHubStation) => void
}

export function SelectHubStep({ stations, isLoading, onSelect }: SelectHubStepProps) {
    return (
        <View className='flex-1'>
            <View className='px-4 py-4'>
                <Text className='text-base font-bold text-neutral-900'>Select Destination Hub</Text>
                <Text className='mt-0.5 text-xs text-neutral-500'>Choose the hub station to send batteries to</Text>
            </View>
            {isLoading ? (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator
                        size='large'
                        color='#D97706'
                    />
                </View>
            ) : stations.length === 0 ? (
                <View className='flex-1 items-center justify-center px-8'>
                    <MaterialCommunityIcons
                        name='warehouse'
                        size={48}
                        color='#D1D5DB'
                    />
                    <Text className='mt-4 text-base font-semibold text-neutral-400'>No hub stations available</Text>
                </View>
            ) : (
                <FlatList
                    data={stations}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <HubStationListItem
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
