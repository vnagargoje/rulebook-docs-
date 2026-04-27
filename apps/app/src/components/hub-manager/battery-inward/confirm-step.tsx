import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'

import { Button, Text, View } from '@/components/ui'
import type { Movement } from '@/queries/hub-manager/movements.query'

import { ConfirmBatteryList } from '../shared'

interface ConfirmStepProps {
    selectedMovement: Movement | null
    scannedBatteries: string[]
    isPending: boolean
    onSubmit: () => void
    onBackToScan: () => void
}

export function ConfirmStep({
    selectedMovement,
    scannedBatteries,
    isPending,
    onSubmit,
    onBackToScan,
}: ConfirmStepProps) {
    return (
        <View className='flex-1'>
            {/* Summary header */}
            <View className='mx-4 mt-4 rounded-2xl border border-primary-100 bg-primary-50 px-4 py-4'>
                <Text className='text-xs font-bold uppercase tracking-[1px] text-primary-400 mb-2'>
                    Receive Summary
                </Text>
                <View className='flex-row items-center mb-1.5'>
                    <MaterialCommunityIcons
                        name='map-marker-outline'
                        size={14}
                        color='#2563EB'
                    />
                    <Text className='ml-2 text-sm text-primary-700 font-semibold'>
                        From: {selectedMovement?.fromStation?.name ?? selectedMovement?.fromStationId}
                    </Text>
                </View>
                <View className='flex-row items-center'>
                    <MaterialCommunityIcons
                        name='truck-outline'
                        size={14}
                        color='#2563EB'
                    />
                    <Text className='ml-2 text-sm text-primary-700 font-semibold'>
                        {selectedMovement?.vehicle?.vehicleNumber ?? 'Unknown vehicle'}
                    </Text>
                </View>
            </View>

            <ConfirmBatteryList
                batteryQrIds={scannedBatteries}
                label='Batteries to Receive'
            />

            {/* Action buttons */}
            <View className='px-4 py-4 border-t border-neutral-100 bg-white gap-3'>
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
