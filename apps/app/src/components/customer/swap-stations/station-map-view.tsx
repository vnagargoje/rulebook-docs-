import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { Platform, StyleSheet } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ActivityIndicator, Text, TouchableOpacity, View } from '@/components/ui'
import { useNearbyStationsMap } from '@/hooks/customer/use-nearby-stations-map'

const MAP_INITIAL_DELTA = 0.05

type StationsMapViewProps = {
    coords: { latitude: number; longitude: number }
}

export function StationsMapView({ coords }: StationsMapViewProps) {
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const { mapRef, onMapReady, stations, totalFound, isLoading, isRefetching, refetch, openInMaps } =
        useNearbyStationsMap(coords)

    return (
        <View className='flex-1'>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                initialRegion={{
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: MAP_INITIAL_DELTA,
                    longitudeDelta: MAP_INITIAL_DELTA,
                }}
                onMapReady={onMapReady}
                showsUserLocation
                showsMyLocationButton={false}
                showsCompass
                zoomEnabled={true}
                scrollEnabled={true}
                pitchEnabled={true}
                rotateEnabled={true}>
                {stations.map((station) => (
                    <Marker
                        key={station.id}
                        coordinate={{
                            latitude: Number(station.latitude),
                            longitude: Number(station.longitude),
                        }}
                        title={station.name}
                        description={`${station.distanceKm.toFixed(1)} km away · Tap to open in Maps`}
                        onCalloutPress={() =>
                            openInMaps(Number(station.latitude), Number(station.longitude))
                        }
                    />
                ))}
            </MapView>

            <View
                className='absolute left-0 right-0 flex-row items-center gap-2 px-4'
                style={{ top: insets.top + 12 }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className='h-10 w-10 items-center justify-center rounded-full bg-white'
                    style={styles.shadow}>
                    <MaterialCommunityIcons name='arrow-left' size={22} color='#111827' />
                </TouchableOpacity>

                <View className='flex-1 rounded-2xl bg-white px-4 py-2.5' style={styles.shadow}>
                    <Text className='text-sm font-bold text-neutral-900'>Nearby Swap Stations</Text>
                    {!isLoading && (
                        <Text className='text-xs text-neutral-500'>
                            {totalFound} station{totalFound !== 1 ? 's' : ''} near you
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={() => refetch()}
                    disabled={isRefetching || isLoading}
                    className='h-10 w-10 items-center justify-center rounded-full bg-white'
                    style={styles.shadow}>
                    {isRefetching ? (
                        <ActivityIndicator size='small' color='#2563EB' />
                    ) : (
                        <MaterialCommunityIcons name='refresh' size={22} color='#2563EB' />
                    )}
                </TouchableOpacity>
            </View>

            {isLoading && (
                <View className='absolute inset-0 items-center justify-center'>
                    <View className='rounded-2xl bg-white px-6 py-4' style={styles.shadow}>
                        <ActivityIndicator size='small' color='#2563EB' />
                        <Text className='mt-2 text-center text-sm text-neutral-600'>
                            Finding stations...
                        </Text>
                    </View>
                </View>
            )}

            {!isLoading && totalFound > 0 && (
                <View
                    className='absolute left-4 right-4 rounded-2xl bg-white px-4 py-3'
                    style={[styles.shadow, { bottom: insets.bottom + 16 }]}>
                    <Text className='text-center text-xs text-neutral-500'>
                        Tap a marker callout to open in Google Maps
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
})
