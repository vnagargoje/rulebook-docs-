import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'

import { Text, View } from '@/components/ui'
import type { StationDetail } from '@/queries/customer/stations.query'

import { DirectionsButton } from './directions-button'
import { InfoRow } from './info-row'

type Props = {
    snapPoints: string[]
    station: StationDetail
    lat: number | null
    lng: number | null
    hasCoords: boolean
    routeCoords: unknown[] | null
    isFetchingDirections: boolean
    paddingBottom: number
    onGetDirections: () => void
    onClearDirections: () => void
}

export function StationSheet({
    snapPoints,
    station,
    lat,
    lng,
    hasCoords,
    routeCoords,
    isFetchingDirections,
    paddingBottom,
    onGetDirections,
    onClearDirections,
}: Props) {
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

    const manager = station.managers?.[0]
    const managerName = manager
        ? [manager.firstName, manager.lastName].filter(Boolean).join(' ') ||
          manager.mobilenumber ||
          null
        : null

    return (
        <BottomSheet
            snapPoints={snapPoints}
            index={0}
            handleIndicatorStyle={sheetHandleStyle}
            backgroundStyle={sheetBackgroundStyle}>
            <BottomSheetScrollView contentContainerStyle={{ paddingBottom }}>
                {/* Station header */}
                <View className='px-5 pt-2'>
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
                            className={`rounded-full px-3 py-1.5 ${station.active ? 'bg-success-100' : 'bg-neutral-100'}`}>
                            <Text
                                className={`text-xs font-bold ${station.active ? 'text-success-700' : 'text-neutral-500'}`}>
                                {station.active ? 'Open' : 'Closed'}
                            </Text>
                        </View>
                    </View>

                    <View className='mt-2 flex-row flex-wrap gap-2'>
                        <View className='rounded-full bg-primary-50 px-3 py-1'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-primary-600'>
                                Swap Station
                            </Text>
                        </View>
                        {hasCoords && lat !== null && lng !== null && (
                            <View className='rounded-full bg-neutral-100 px-3 py-1'>
                                <Text className='text-[10px] font-semibold text-neutral-500'>
                                    {lat.toFixed(4)}, {lng.toFixed(4)}
                                </Text>
                            </View>
                        )}
                    </View>

                    {hasCoords && (
                        <View className='mt-4'>
                            <DirectionsButton
                                routeCoords={routeCoords}
                                isFetchingDirections={isFetchingDirections}
                                onGetDirections={onGetDirections}
                                onClearDirections={onClearDirections}
                            />
                        </View>
                    )}
                </View>

                {/* Station details */}
                <View className='mx-5 mt-5 border-b border-neutral-100' />
                <View className='px-5 pt-4'>
                    <Text className='mb-1 text-[11px] font-bold uppercase tracking-[1.4px] text-neutral-400'>
                        Station Details
                    </Text>
                    {addressLine ? (
                        <InfoRow icon='map-marker-outline' label='Address' value={addressLine} />
                    ) : null}
                    {station.address?.pincode ? (
                        <InfoRow icon='mailbox-outline' label='PIN Code' value={station.address.pincode} />
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
                    {hasCoords && lat !== null && lng !== null ? (
                        <>
                            <InfoRow icon='latitude' label='Latitude' value={lat.toString()} />
                            <InfoRow icon='longitude' label='Longitude' value={lng.toString()} />
                        </>
                    ) : null}
                </View>

                {/* Manager section */}
                {managerName || manager?.email || manager?.mobilenumber ? (
                    <View className='px-5 pt-4'>
                        <View className='border-t border-neutral-100 pt-4'>
                            <Text className='mb-1 text-[11px] font-bold uppercase tracking-[1.4px] text-neutral-400'>
                                Station Manager
                            </Text>
                            {managerName ? (
                                <InfoRow icon='account-outline' label='Manager' value={managerName} />
                            ) : null}
                            {manager?.email ? (
                                <InfoRow icon='email-outline' label='Email' value={manager.email} />
                            ) : null}
                            {manager?.mobilenumber ? (
                                <InfoRow
                                    icon='phone-outline'
                                    label='Mobile'
                                    value={manager.mobilenumber}
                                />
                            ) : null}
                        </View>
                    </View>
                ) : null}
            </BottomSheetScrollView>
        </BottomSheet>
    )
}

const sheetHandleStyle = { backgroundColor: '#D1D5DB', width: 40 }
const sheetBackgroundStyle = { borderTopLeftRadius: 24, borderTopRightRadius: 24 }
