import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Linking } from 'react-native'
import type MapView from 'react-native-maps'

import { useNearestSwapStations } from '@/queries/customer'

type Coords = {
    latitude: number
    longitude: number
}

export function useNearbyStationsMap(coords: Coords) {
    const mapRef = useRef<MapView>(null)
    const isMapReadyRef = useRef(false)

    const { data: stations, isLoading, isRefetching, refetch } = useNearestSwapStations({
        variables: { latitude: coords.latitude, longitude: coords.longitude },
    })

    const stationsWithCoords = useMemo(
        () =>
            (stations ?? []).filter(
                (s): s is typeof s & { latitude: number; longitude: number } =>
                    s.latitude != null && s.longitude != null,
            ),
        [stations],
    )

    const fitToAll = useCallback(
        (animated = true) => {
            if (!stationsWithCoords.length || !isMapReadyRef.current) return

            const allCoords: Coords[] = [
                { latitude: coords.latitude, longitude: coords.longitude },
                ...stationsWithCoords.map((s) => ({
                    latitude: Number(s.latitude),
                    longitude: Number(s.longitude),
                })),
            ]

            mapRef.current?.fitToCoordinates(allCoords, {
                edgePadding: { top: 120, right: 40, bottom: 140, left: 40 },
                animated,
            })
        },
        [stationsWithCoords, coords.latitude, coords.longitude],
    )

    const onMapReady = useCallback(() => {
        isMapReadyRef.current = true
        fitToAll(false)
    }, [fitToAll])

    useEffect(() => {
        fitToAll()
    }, [fitToAll])

    const openInMaps = useCallback((lat: number, lng: number) => {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`)
    }, [])

    return {
        mapRef,
        onMapReady,
        stations: stationsWithCoords,
        totalFound: stationsWithCoords.length,
        isLoading,
        isRefetching,
        refetch,
        openInMaps,
    }
}
