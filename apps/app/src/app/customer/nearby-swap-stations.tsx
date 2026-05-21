import { StationsMapView } from '@/components/customer/swap-stations/station-map-view'
import { PermissionDeniedView } from '@/components/location-permission'
import { ScreenLoader } from '@/components/ui'
import { useLocation } from '@/hooks/customer/use-location'

export default function NearestSwapStationsScreen() {
    const { coords, permissionDenied, loading } = useLocation()

    if (loading) {
        return <ScreenLoader label='Getting your location...' />
    }

    if (permissionDenied) {
        return <PermissionDeniedView />
    }

    return <StationsMapView coords={coords!} />
}
