import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'

import { Button, Text, View } from '@/components/ui'
import type { SwapStation, TransportVehicle } from '@/queries/hub-manager/stations-vehicles.query'

import { ConfirmBatteryList } from '../shared'

interface ConfirmStepProps {
    selectedStation: SwapStation | null
    selectedVehicle: TransportVehicle | null
    scannedBatteries: string[]
    isPending: boolean
    onSubmit: () => void
    onBackToScan: () => void
}

export function ConfirmStep({
    selectedStation,
    selectedVehicle,
    scannedBatteries,
    isPending,
    onSubmit,
    onBackToScan,
}: ConfirmStepProps) {
    return (
        <View className='flex-1'>
            {/* Summary header */}
            <View className='mx-4 mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4'>
                <Text className='text-xs font-bold uppercase tracking-[1px] text-emerald-400 mb-2'>
                    Dispatch Summary
                </Text>
                <View className='flex-row items-center mb-1.5'>
                    <MaterialCommunityIcons
                        name='map-marker-outline'
                        size={14}
                        color='#059669'
                    />
                    <Text className='ml-2 text-sm text-emerald-700 font-semibold'>
                        To: {selectedStation?.name ?? selectedStation?.id}
                    </Text>
                </View>
                <View className='flex-row items-center'>
                    <MaterialCommunityIcons
                        name='truck-outline'
                        size={14}
                        color='#059669'
                    />
                    <Text className='ml-2 text-sm text-emerald-700 font-semibold'>
                        {selectedVehicle?.vehicleNumber ?? 'Unknown vehicle'}
                    </Text>
                </View>
            </View>

            <ConfirmBatteryList
                batteryQrIds={scannedBatteries}
                label='Batteries to Dispatch'
                batteryIconColor='#059669'
                batteryIconBgClass='bg-emerald-50'
            />

            {/* Action buttons */}
            <View className='px-4 py-4 border-t border-neutral-100 bg-white gap-3'>
                <Button
                    label={
                        isPending
                            ? 'Dispatching...'
                            : `Confirm & Dispatch ${scannedBatteries.length} ${scannedBatteries.length === 1 ? 'Battery' : 'Batteries'}`
                    }
                    onPress={onSubmit}
                    disabled={isPending}
                    className='h-12 rounded-2xl'
                />
                <Pressable
                    onPress={onBackToScan}
                    className='items-center py-2'>
                    <Text className='text-sm font-semibold text-neutral-500'>← Back to Scan</Text>
                </Pressable>
            </View>
        </View>
    )
}
