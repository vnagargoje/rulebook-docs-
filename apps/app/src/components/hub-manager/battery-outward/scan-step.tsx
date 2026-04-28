import { ScrollView } from 'react-native'

import { QrScanner } from '@/components/ui/qr-scanner'
import { Button, Text, View } from '@/components/ui'
import type { SwapStation, TransportVehicle } from '@/queries/hub-manager/stations-vehicles.query'

import { ScannedBatteryItem } from '../shared'

interface ScanStepProps {
    selectedStation: SwapStation | null
    selectedVehicle: TransportVehicle | null
    scannedBatteries: string[]
    onScan: (data: string) => void
    onRemove: (id: string) => void
    onProceedToConfirm: () => void
}

export function ScanStep({
    selectedStation,
    selectedVehicle,
    scannedBatteries,
    onScan,
    onRemove,
    onProceedToConfirm,
}: ScanStepProps) {
    return (
        <View className='flex-1'>
            {/* Selected destination info */}
            <View className='mx-4 mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3'>
                <Text className='text-xs font-semibold text-emerald-700'>
                    To: {selectedStation?.name ?? selectedStation?.id}
                </Text>
                <Text className='mt-0.5 text-xs text-emerald-500'>
                    Vehicle: {selectedVehicle?.vehicleNumber ?? 'Unknown'}
                </Text>
            </View>

            {/* QR Scanner */}
            <View
                className='mx-4 mt-4 overflow-hidden rounded-3xl'
                style={{ height: 280 }}>
                <QrScanner
                    onScan={onScan}
                    title='Scan Battery QR'
                    description='Point camera at battery QR code'
                />
            </View>

            {/* Scanned List */}
            <View className='flex-1 px-4 mt-4'>
                <View className='flex-row items-center justify-between mb-2'>
                    <Text className='text-xs font-bold uppercase tracking-[1px] text-neutral-400'>
                        Scanned Batteries
                    </Text>
                    <View className='rounded-full bg-emerald-100 px-2.5 py-0.5'>
                        <Text className='text-xs font-bold text-emerald-600'>{scannedBatteries.length}</Text>
                    </View>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
                    {scannedBatteries.map((batteryQrId) => (
                        <ScannedBatteryItem
                            key={batteryQrId}
                            batteryQrId={batteryQrId}
                            onRemove={onRemove}
                            iconName='battery-charging'
                            iconColor='#059669'
                            iconBgClass='bg-emerald-50'
                        />
                    ))}
                    {scannedBatteries.length === 0 && (
                        <Text className='text-center text-sm text-neutral-400 py-4'>No batteries scanned yet</Text>
                    )}
                </ScrollView>
            </View>

            {/* Proceed Button */}
            <View className='px-4 py-4 border-t border-neutral-100 bg-white'>
                <Button
                    label={`Review ${scannedBatteries.length} ${scannedBatteries.length === 1 ? 'Battery' : 'Batteries'}`}
                    onPress={onProceedToConfirm}
                    disabled={scannedBatteries.length === 0}
                    className={`h-12 rounded-2xl ${scannedBatteries.length === 0 ? 'opacity-50' : ''}`}
                />
            </View>
        </View>
    )
}
