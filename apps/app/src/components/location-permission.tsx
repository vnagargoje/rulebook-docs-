import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Text, TouchableOpacity, View } from '@/components/ui'

export function PermissionDeniedView() {
    const router = useRouter()
    const insets = useSafeAreaInsets()

    return (
        <View className='flex-1 bg-white px-8'>
            <TouchableOpacity
                onPress={() => router.back()}
                className='absolute left-4 h-10 w-10 items-center justify-center rounded-full bg-neutral-100'
                style={{ top: insets.top + 12 }}>
                <MaterialCommunityIcons name='arrow-left' size={22} color='#111827' />
            </TouchableOpacity>

            <View className='flex-1 items-center justify-center'>
                <View className='h-20 w-20 items-center justify-center rounded-full bg-warning-50'>
                    <MaterialCommunityIcons name='map-marker-off-outline' size={40} color='#D97706' />
                </View>
                <Text className='mt-5 text-center text-xl font-bold text-neutral-900'>
                    Location Access Required
                </Text>
                <Text className='mt-2 text-center text-sm leading-6 text-neutral-500'>
                    Please enable location permission in your device settings to find nearby swap stations.
                </Text>
                <TouchableOpacity
                    onPress={() => Linking.openSettings()}
                    className='mt-6 flex-row items-center gap-2 rounded-2xl bg-primary-600 px-6 py-3'>
                    <MaterialCommunityIcons name='cog-outline' size={16} color='white' />
                    <Text className='text-sm font-semibold text-white'>Open Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
