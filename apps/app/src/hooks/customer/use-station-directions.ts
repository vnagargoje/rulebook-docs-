import { useCallback, useRef, useState } from 'react'
import { Alert } from 'react-native'
import * as Location from 'expo-location'
import type MapView from 'react-native-maps'

import Env from '../../../env'

export type MapMode = 'standard' | 'satellite' | 'hybrid'

export const MAP_MODE_CYCLE: MapMode[] = ['standard', 'satellite', 'hybrid']

export const MAP_MODE_ICON: Record<MapMode, string> = {
    standard: 'satellite-variant',
    satellite: 'layers-outline',
    hybrid: 'map-outline',
}

export const MAP_MODE_LABEL: Record<MapMode, string> = {
    standard: 'Satellite',
    satellite: 'Hybrid',
    hybrid: 'Map',
}

export const MAP_DELTA = 0.01

function decodePolyline(encoded: string): { latitude: number; longitude: number }[] {
    let index = 0
    const len = encoded.length
    const coords: { latitude: number; longitude: number }[] = []
    let lat = 0
    let lng = 0

    while (index < len) {
        let shift = 0
        let result = 0
        let b: number
        do {
            b = encoded.charCodeAt(index++) - 63
            result |= (b & 0x1f) << shift
            shift += 5
        } while (b >= 0x20)
        lat += (result & 1) !== 0 ? ~(result >> 1) : result >> 1

        shift = 0
        result = 0
        do {
            b = encoded.charCodeAt(index++) - 63
            result |= (b & 0x1f) << shift
            shift += 5
        } while (b >= 0x20)
        lng += (result & 1) !== 0 ? ~(result >> 1) : result >> 1

        coords.push({ latitude: lat / 1e5, longitude: lng / 1e5 })
    }
    return coords
}

export function useStationDirections(lat: number | null, lng: number | null) {
    const mapRef = useRef<MapView>(null)
    const hasCoords = lat !== null && lng !== null

    const [mapMode, setMapMode] = useState<MapMode>('standard')
    const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[] | null>(null)
    const [showUserLocation, setShowUserLocation] = useState(false)
    const [isFetchingDirections, setIsFetchingDirections] = useState(false)

    const cycleMapMode = useCallback(() => {
        setMapMode(prev => {
            const nextIndex = (MAP_MODE_CYCLE.indexOf(prev) + 1) % MAP_MODE_CYCLE.length
            return MAP_MODE_CYCLE[nextIndex]
        })
    }, [])

    const handleGetDirections = useCallback(async () => {
        if (!hasCoords) return
        setIsFetchingDirections(true)
        try {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location access is required to show directions.')
                return
            }
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            })
            const origin = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
            setShowUserLocation(true)

            const url =
                `https://maps.googleapis.com/maps/api/directions/json` +
                `?origin=${origin.latitude},${origin.longitude}` +
                `&destination=${lat},${lng}` +
                `&mode=driving` +
                `&key=${Env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`

            const res = await fetch(url)
            const json = await res.json()

            if (json.status !== 'OK' || !json.routes?.length) {
                Alert.alert('Directions Unavailable', 'Could not find a route to this station.')
                return
            }

            const points = decodePolyline(json.routes[0].overview_polyline.points)
            setRouteCoords(points)

            mapRef.current?.fitToCoordinates([origin, { latitude: lat!, longitude: lng! }], {
                edgePadding: { top: 80, right: 40, bottom: 320, left: 40 },
                animated: true,
            })
        } catch {
            Alert.alert('Error', 'Failed to get directions. Please try again.')
        } finally {
            setIsFetchingDirections(false)
        }
    }, [hasCoords, lat, lng])

    const handleClearDirections = useCallback(() => {
        setRouteCoords(null)
        setShowUserLocation(false)
        if (hasCoords) {
            mapRef.current?.animateToRegion(
                { latitude: lat!, longitude: lng!, latitudeDelta: MAP_DELTA, longitudeDelta: MAP_DELTA },
                400,
            )
        }
    }, [hasCoords, lat, lng])

    return {
        mapRef,
        mapMode,
        routeCoords,
        showUserLocation,
        isFetchingDirections,
        cycleMapMode,
        handleGetDirections,
        handleClearDirections,
    }
}
