import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Pressable, Text, View } from '@/components/ui'
import { openLinkInBrowser } from '@/lib/utils'
import { useVehicleStations } from '@/queries/customer'
import type { Station } from '@/queries/customer'

type Props = {
    variant?: 'light' | 'dark' | 'inline'
}

export function buildAddress(station: Station): string {
    const parts: string[] = []
    if (station.address?.lineOne) parts.push(station.address.lineOne)
    if (station.address?.lineTwo) parts.push(station.address.lineTwo)
    if (station.address?.city?.name) parts.push(station.address.city.name)
    if (station.address?.city?.state?.name) parts.push(station.address.city.state.name)
    if (station.address?.pincode) parts.push(station.address.pincode)
    return parts.join(', ')
}

export function StationRow({ station, isDark }: { station: Station; isDark: boolean }) {
    const address = buildAddress(station)
    const hasCoords = station.latitude != null && station.longitude != null

    return (
        <View className='gap-3'>
            <View className={`flex-row items-start gap-3`}>
                <View
                    className={`mt-0.5 h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        isDark ? 'bg-primary-500/20' : 'bg-primary-50'
                    }`}>
                    <MaterialCommunityIcons name='map-marker' size={22} color='#3B82F6' />
                </View>

                <View className='flex-1'>
                    <Text
                        className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {station.name}
                    </Text>
                    {address.length > 0 && (
                        <Text
                            className={`mt-1 text-xs leading-5 ${isDark ? 'text-[#8EA0BE]' : 'text-neutral-500'}`}>
                            {address}
                        </Text>
                    )}
                </View>
            </View>

            {hasCoords && (
                <Pressable
                    onPress={() =>
                        openLinkInBrowser(
                            `https://maps.google.com/?q=${station.latitude},${station.longitude}`,
                        )
                    }
                    className={`flex-row items-center justify-center gap-2 rounded-xl px-4 py-2.5 ${
                        isDark ? 'bg-primary-600' : 'bg-primary-600'
                    }`}>
                    <MaterialCommunityIcons name='directions' size={16} color='#fff' />
                    <Text className='text-sm font-bold text-white'>Get Directions</Text>
                </Pressable>
            )}
        </View>
    )
}

export function VehiclePickupLocations({ variant = 'light' }: Props) {
    const { data, isLoading } = useVehicleStations()
    const stations = data?.data ?? []

    if (isLoading || stations.length === 0) return null

    const isDark = variant === 'dark'
    const isInline = variant === 'inline'

    const stationList = (
        <View className='gap-3'>
            {stations.map((station, index) => (
                <View key={station.id}>
                    {index > 0 && (
                        <View
                            className={`mb-3 h-px ${isDark ? 'bg-white/10' : 'bg-neutral-100'}`}
                        />
                    )}
                    <StationRow station={station} isDark={isDark} />
                </View>
            ))}
        </View>
    )

    if (isInline) return stationList

    return (
        <View className={`mt-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-neutral-50'} p-4`}>
            <View className='mb-4 flex-row items-center gap-1.5'>
                <MaterialCommunityIcons
                    name='map-marker-multiple-outline'
                    size={13}
                    color={isDark ? '#8EA0BE' : '#9CA3AF'}
                />
                <Text
                    className={`text-[10px] font-semibold uppercase tracking-[1px] ${isDark ? 'text-[#8EA0BE]' : 'text-neutral-400'}`}>
                    Vehicle Pickup Location(s)
                </Text>
            </View>
            {stationList}
        </View>
    )
}
