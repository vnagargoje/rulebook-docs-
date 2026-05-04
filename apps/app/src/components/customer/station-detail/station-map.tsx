import { type RefObject } from 'react'
import { Platform, StyleSheet } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'

import { Text, View } from '@/components/ui'
import { MAP_DELTA } from '@/hooks/customer/use-station-directions'
import type { MapMode } from '@/hooks/customer/use-station-directions'

type Props = {
    mapRef: RefObject<MapView | null>
    lat: number
    lng: number
    mapMode: MapMode
    showUserLocation: boolean
    routeCoords: { latitude: number; longitude: number }[] | null
    stationName: string
    cityName?: string
}

export function StationMap({
    mapRef,
    lat,
    lng,
    mapMode,
    showUserLocation,
    routeCoords,
    stationName,
    cityName,
}: Props) {
    return (
        <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            mapType={mapMode}
            initialRegion={{
                latitude: lat,
                longitude: lng,
                latitudeDelta: MAP_DELTA,
                longitudeDelta: MAP_DELTA,
            }}
            showsUserLocation={showUserLocation}
            showsMyLocationButton={false}
            showsCompass={true}
            scrollEnabled={true}
            zoomEnabled={true}
            rotateEnabled={true}
            pitchEnabled={true}>
            <Marker
                coordinate={{ latitude: lat, longitude: lng }}
                title={stationName}
                description={cityName}
            />
            {routeCoords && (
                <Polyline
                    coordinates={routeCoords}
                    strokeColor='#2563EB'
                    strokeWidth={4}
                />
            )}
        </MapView>
    )
}

export function NoLocationPlaceholder() {
    return (
        <View className='flex-1 items-center justify-center bg-neutral-100'>
            <MaterialCommunityIcons name='map-marker-off-outline' size={48} color='#9CA3AF' />
            <Text className='mt-3 text-sm text-neutral-400'>Location not available</Text>
        </View>
    )
}
