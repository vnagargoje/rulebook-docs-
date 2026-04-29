import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { ActivityIndicator, Text, TouchableOpacity, View } from '@/components/ui'

type Props = {
    routeCoords: unknown[] | null
    isFetchingDirections: boolean
    onGetDirections: () => void
    onClearDirections: () => void
}

export function DirectionsButton({
    routeCoords,
    isFetchingDirections,
    onGetDirections,
    onClearDirections,
}: Props) {
    if (routeCoords) {
        return (
            <TouchableOpacity
                onPress={onClearDirections}
                className='flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 py-3'>
                <MaterialCommunityIcons name='close-circle-outline' size={18} color='#6B7280' />
                <Text className='text-sm font-semibold text-neutral-600'>Clear Route</Text>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity
            onPress={onGetDirections}
            disabled={isFetchingDirections}
            className='flex-row items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5'>
            {isFetchingDirections ? (
                <ActivityIndicator size='small' color='#fff' />
            ) : (
                <MaterialCommunityIcons name='navigation-variant' size={18} color='#fff' />
            )}
            <Text className='text-sm font-semibold text-white'>
                {isFetchingDirections ? 'Getting your location...' : 'Get Directions'}
            </Text>
        </TouchableOpacity>
    )
}
