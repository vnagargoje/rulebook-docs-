import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

type LocationCoords = {
    latitude: number
    longitude: number
}

type UseLocationResult = {
    coords: LocationCoords | null
    permissionDenied: boolean
    loading: boolean
}

export function useLocation(): UseLocationResult {
    const [coords, setCoords] = useState<LocationCoords | null>(null)
    const [permissionDenied, setPermissionDenied] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        ;(async () => {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                if (!cancelled) {
                    setPermissionDenied(true)
                    setLoading(false)
                }
                return
            }
            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            })
            if (!cancelled) {
                setCoords({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                })
                setLoading(false)
            }
        })()

        return () => {
            cancelled = true
        }
    }, [])

    return { coords, permissionDenied, loading }
}
