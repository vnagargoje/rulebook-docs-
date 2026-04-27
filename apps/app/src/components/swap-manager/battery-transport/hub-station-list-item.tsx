import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'

import { Text, View } from '@/components/ui'
import type { SMHubStation } from '@/queries/swap-manager/battery-transport.query'

interface HubStationListItemProps {
    station: SMHubStation
    onSelect: (station: SMHubStation) => void
}

export function HubStationListItem({ station, onSelect }: HubStationListItemProps) {
    return (
        <Pressable
            onPress={() => onSelect(station)}
            className='mx-4 rounded-3xl border border-neutral-100 bg-white p-4 active:opacity-70'>
            <View className='flex-row items-center'>
                <View className='h-10 w-10 items-center justify-center rounded-2xl bg-amber-50'>
                    <MaterialCommunityIcons
                        name='warehouse'
                        size={20}
                        color='#D97706'
                    />
                </View>
                <View className='ml-3 flex-1'>
                    <Text className='text-sm font-bold text-neutral-900'>{station.name ?? station.id}</Text>
                    <Text className='mt-0.5 text-xs text-neutral-400'>Hub Station</Text>
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
