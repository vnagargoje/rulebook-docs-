import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'

import { Button, Text, View } from '@/components/ui'
import { ConfirmBatteryList } from '@/components/hub-manager/shared'
import type { SMMovement } from '@/queries/swap-manager/battery-transport.query'

interface ConfirmStepInwardProps {
    selectedMovement: SMMovement | null
    scannedBatteries: string[]
    isPending: boolean
    onSubmit: () => void
    onBackToScan: () => void
}

export function ConfirmStepInward({
    selectedMovement,
    scannedBatteries,
    isPending,
    onSubmit,
    onBackToScan,
}: ConfirmStepInwardProps) {
    return (
        <View className='flex-1'>
            <View className='mx-4 mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4'>
                <Text className='mb-2 text-xs font-bold uppercase tracking-[1px] text-amber-400'>Receive Summary</Text>
                <View className='mb-1.5 flex-row items-center'>
                    <MaterialCommunityIcons
                        name='map-marker-outline'
                        size={14}
                        color='#D97706'
                    />
                    <Text className='ml-2 text-sm font-semibold text-amber-700'>
                        From: {selectedMovement?.fromStation?.name ?? selectedMovement?.fromStationId}
                    </Text>
                </View>
                <View className='flex-row items-center'>
                    <MaterialCommunityIcons
                        name='truck-outline'
                        size={14}
                        color='#D97706'
                    />
                    <Text className='ml-2 text-sm font-semibold text-amber-700'>
                        {selectedMovement?.vehicle?.vehicleNumber ?? 'Unknown vehicle'}
                    </Text>
                </View>
            </View>

            <ConfirmBatteryList
                batteryQrIds={scannedBatteries}
                label='Batteries to Receive'
                batteryIconColor='#D97706'
                batteryIconBgClass='bg-amber-50'
            />

            <View className='gap-3 border-t border-neutral-100 bg-white px-4 py-4'>
                <Button
                    label={
                        isPending
                            ? 'Receiving...'
                            : `Confirm & Receive ${scannedBatteries.length} ${scannedBatteries.length === 1 ? 'Battery' : 'Batteries'}`
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
