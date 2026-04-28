import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ScreenLoader, Text, TouchableOpacity, View } from '@/components/ui'
import { NoLocationPlaceholder, StationMap, StationSheet } from '@/components/customer/station-detail'
import { useStationDirections, MAP_MODE_ICON, MAP_MODE_LABEL } from '@/hooks/customer/use-station-directions'
import { useStationById } from '@/queries/customer'

export default function StationDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const { data: station, isLoading } = useStationById({ variables: { id: id! } })

    const lat = station?.latitude != null ? Number(station.latitude) : null
    const lng = station?.longitude != null ? Number(station.longitude) : null
    const hasCoords = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)

    const {
        mapRef,
        mapMode,
        routeCoords,
        showUserLocation,
        isFetchingDirections,
        cycleMapMode,
        handleGetDirections,
        handleClearDirections,
    } = useStationDirections(hasCoords ? lat : null, hasCoords ? lng : null)

    const snapPoints = useMemo(() => ['38%', '80%'], [])

    if (isLoading || !station) {
        return <ScreenLoader label='Loading station...' />
    }

    const cityName = station.address?.city?.name

    return (
        <View className='flex-1 bg-neutral-900'>
            {hasCoords ? (
                <StationMap
                    mapRef={mapRef}
                    lat={lat!}
                    lng={lng!}
                    mapMode={mapMode}
                    showUserLocation={showUserLocation}
                    routeCoords={routeCoords}
                    stationName={station.name}
                    cityName={cityName}
                />
            ) : (
                <NoLocationPlaceholder />
            )}

            {/* Back button */}
            <TouchableOpacity
                onPress={() => router.back()}
                className='h-10 w-10 items-center justify-center rounded-full bg-white'
                style={[styles.shadow, { position: 'absolute', top: insets.top + 12, left: 16 }]}>
                <MaterialCommunityIcons name='arrow-left' size={22} color='#111827' />
            </TouchableOpacity>

            {/* Map mode toggle */}
            {hasCoords && (
                <TouchableOpacity
                    onPress={cycleMapMode}
                    className='flex-row items-center gap-1.5 rounded-full bg-white px-3 py-2'
                    style={[styles.shadow, { position: 'absolute', top: insets.top + 12, right: 16 }]}>
                    <MaterialCommunityIcons
                        name={MAP_MODE_ICON[mapMode] as any}
                        size={16}
                        color='#374151'
                    />
                    <Text className='text-xs font-semibold text-neutral-700'>
                        {MAP_MODE_LABEL[mapMode]}
                    </Text>
                </TouchableOpacity>
            )}

            <StationSheet
                snapPoints={snapPoints}
                station={station}
                lat={lat}
                lng={lng}
                hasCoords={hasCoords}
                routeCoords={routeCoords}
                isFetchingDirections={isFetchingDirections}
                paddingBottom={insets.bottom + 32}
                onGetDirections={handleGetDirections}
                onClearDirections={handleClearDirections}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
})

