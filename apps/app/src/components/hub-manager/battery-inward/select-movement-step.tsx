import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ActivityIndicator, FlatList } from 'react-native'

import { Text, View } from '@/components/ui'
import type { Movement } from '@/queries/hub-manager/movements.query'
import { MovementListItem } from './movement-list-item'


interface SelectMovementStepProps {
    movements: Movement[]
    isLoading: boolean
    onSelect: (movement: Movement) => void
}

export function SelectMovementStep({ movements, isLoading, onSelect }: SelectMovementStepProps) {
    return (
        <View className='flex-1'>
            <View className='px-4 py-4'>
                <Text className='text-base font-bold text-neutral-900'>Select Incoming Movement</Text>
                <Text className='mt-0.5 text-xs text-neutral-500'>
                    Choose the transport vehicle movement to receive batteries from
                </Text>
            </View>
            {isLoading ? (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator
                        size='large'
                        color='#2563EB'
                    />
                </View>
            ) : movements.length === 0 ? (
                <View className='flex-1 items-center justify-center px-8'>
                    <MaterialCommunityIcons
                        name='truck-outline'
                        size={48}
                        color='#D1D5DB'
                    />
                    <Text className='mt-4 text-base font-semibold text-neutral-400'>No movements in transit</Text>
                    <Text className='mt-1 text-center text-sm text-neutral-400'>
                        There are no transport vehicles currently en route to this hub
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={movements}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <MovementListItem
                            movement={item}
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
