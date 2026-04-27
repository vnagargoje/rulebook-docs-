import { useLocalSearchParams, useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Platform } from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps'

import { ScreenLoader, ScrollView, Text, View } from '@/components/ui'
import { useStationById } from '@/queries/customer'

const DELTA = 0.01

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: string
    label: string
    value: string
}) {
    return (
        <View className='flex-row items-center gap-4 py-3.5'>
            <View className='h-9 w-9 items-center justify-center rounded-xl bg-primary-50'>
                <MaterialCommunityIcons name={icon as any} size={18} color='#2563EB' />
            </View>
            <View className='flex-1'>
                <Text className='text-xs text-neutral-500'>{label}</Text>
                <Text className='mt-0.5 text-[15px] font-semibold text-neutral-900'>{value}</Text>
            </View>
        </View>
    )
}

export default function StationDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const router = useRouter()
    const { data: station, isLoading } = useStationById({ variables: { id: id! } })

    if (isLoading || !station) {
        return <ScreenLoader label='Loading station...' />
    }

    const hasCoords =
        typeof station.latitude === 'number' && typeof station.longitude === 'number'

    const cityName = station.address?.city?.name
    const stateName = station.address?.city?.state?.name
    const addressLine = station.address
        ? [
              station.address.lineOne,
              station.address.lineTwo,
              cityName,
              stateName,
              station.address.pincode,
          ]
              .filter(Boolean)
              .join(', ')
        : null

    const managerName = station.manager
        ? [station.manager.firstName, station.manager.lastName].filter(Boolean).join(' ') ||
          station.manager.mobilenumber ||
          null
        : null

    return (
        <View className='flex-1 bg-neutral-50'>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Map / header */}
                <View className='overflow-hidden'>
                    {hasCoords ? (
                        <MapView
                            style={{ width: '100%', height: 240 }}
                            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                            initialRegion={{
                                latitude: station.latitude!,
                                longitude: station.longitude!,
                                latitudeDelta: DELTA,
                                longitudeDelta: DELTA,
                            }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            rotateEnabled={false}
                            pitchEnabled={false}>
                            <Marker
                                coordinate={{
                                    latitude: station.latitude!,
                                    longitude: station.longitude!,
                                }}
                                title={station.name}
                                description={cityName ?? undefined}
                            />
                        </MapView>
                    ) : (
                        <View className='h-60 items-center justify-center bg-neutral-100'>
                            <MaterialCommunityIcons
                                name='map-marker-off-outline'
                                size={40}
                                color='#9CA3AF'
                            />
                            <Text className='mt-2 text-sm text-neutral-400'>Location not available</Text>
                        </View>
                    )}

                    {/* Back button overlay */}
                    <View className='absolute left-4 top-12'>
                        <View
                            className='h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm'
                            style={{ shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 }}>
                            <MaterialCommunityIcons
                                name='arrow-left'
                                size={22}
                                color='#111827'
                                onPress={() => router.back()}
                            />
                        </View>
                    </View>
                </View>

                {/* Title card */}
                <View className='mx-4 -mt-5 overflow-hidden rounded-3xl bg-white p-5 shadow-sm'
                    style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                    <View className='flex-row items-start justify-between gap-3'>
                        <View className='flex-1'>
                            <Text className='text-xl font-bold text-neutral-900'>{station.name}</Text>
                            {cityName ? (
                                <Text className='mt-1 text-sm text-neutral-500'>
                                    {cityName}
                                    {stateName ? `, ${stateName}` : ''}
                                </Text>
                            ) : null}
                        </View>
                        <View
                            className={`rounded-full px-3 py-1.5 ${
                                station.active ? 'bg-success-100' : 'bg-neutral-100'
                            }`}>
                            <Text
                                className={`text-xs font-bold ${
                                    station.active ? 'text-success-700' : 'text-neutral-500'
                                }`}>
                                {station.active ? 'Open' : 'Closed'}
                            </Text>
                        </View>
                    </View>

                    <View className='mt-3 flex-row gap-2'>
                        <View className='rounded-full bg-primary-50 px-3 py-1'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-primary-600'>
                                Swap Station
                            </Text>
                        </View>
                        {hasCoords && (
                            <View className='rounded-full bg-neutral-100 px-3 py-1'>
                                <Text className='text-[10px] font-semibold text-neutral-500'>
                                    {station.latitude!.toFixed(4)}, {station.longitude!.toFixed(4)}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Details section */}
                <View className='mx-4 mt-4 rounded-3xl bg-white p-5'
                    style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
                    <Text className='mb-1 text-[11px] font-bold uppercase tracking-[1.4px] text-neutral-400'>
                        Station Details
                    </Text>

                    <View className='divide-y divide-neutral-100'>
                        {addressLine ? (
                            <InfoRow
                                icon='map-marker-outline'
                                label='Address'
                                value={addressLine}
                            />
                        ) : null}

                        {station.address?.pincode ? (
                            <InfoRow
                                icon='mailbox-outline'
                                label='PIN Code'
                                value={station.address.pincode}
                            />
                        ) : null}

                        {cityName ? (
                            <InfoRow
                                icon='city-variant-outline'
                                label='City'
                                value={`${cityName}${stateName ? `, ${stateName}` : ''}`}
                            />
                        ) : null}

                        {station.address?.city?.state?.code ? (
                            <InfoRow
                                icon='map-outline'
                                label='State Code'
                                value={station.address.city.state.code}
                            />
                        ) : null}

                        {hasCoords ? (
                            <>
                                <InfoRow
                                    icon='latitude'
                                    label='Latitude'
                                    value={station.latitude!.toString()}
                                />
                                <InfoRow
                                    icon='longitude'
                                    label='Longitude'
                                    value={station.longitude!.toString()}
                                />
                            </>
                        ) : null}
                    </View>
                </View>

                {/* Manager section */}
                {managerName || station.manager?.email || station.manager?.mobilenumber ? (
                    <View className='mx-4 mt-4 rounded-3xl bg-white p-5'
                        style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
                        <Text className='mb-1 text-[11px] font-bold uppercase tracking-[1.4px] text-neutral-400'>
                            Station Manager
                        </Text>

                        {managerName ? (
                            <InfoRow
                                icon='account-outline'
                                label='Manager'
                                value={managerName}
                            />
                        ) : null}

                        {station.manager?.email ? (
                            <InfoRow
                                icon='email-outline'
                                label='Email'
                                value={station.manager.email}
                            />
                        ) : null}

                        {station.manager?.mobilenumber ? (
                            <InfoRow
                                icon='phone-outline'
                                label='Mobile'
                                value={station.manager.mobilenumber}
                            />
                        ) : null}
                    </View>
                ) : null}
            </ScrollView>
        </View>
    )
}
