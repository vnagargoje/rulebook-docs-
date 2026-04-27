import { ScrollView } from 'react-native'

import { Button, Text, View } from '@/components/ui'
import { QrScanner } from '@/components/ui/qr-scanner'
import { ScannedBatteryItem } from '@/components/hub-manager/shared'
import type { SMHubStation, SMTransportVehicle } from '@/queries/swap-manager/battery-transport.query'

interface ScanStepOutwardProps {
    selectedHub: SMHubStation | null
    selectedVehicle: SMTransportVehicle | null
    scannedBatteries: string[]
    onScan: (data: string) => void
    onRemove: (id: string) => void
    onProceedToConfirm: () => void
}

export function ScanStepOutward({
    selectedHub,
    selectedVehicle,
    scannedBatteries,
    onScan,
    onRemove,
    onProceedToConfirm,
}: ScanStepOutwardProps) {
    return (
        <View className='flex-1'>
            <View className='mx-4 mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3'>
                <Text className='text-xs font-semibold text-amber-700'>
                    To: {selectedHub?.name ?? selectedHub?.id}
                </Text>
                <Text className='mt-0.5 text-xs text-amber-500'>
                    Vehicle: {selectedVehicle?.vehicleNumber ?? 'Unknown'}
                </Text>
            </View>

            <View
                className='mx-4 mt-4 overflow-hidden rounded-3xl'
                style={{ height: 280 }}>
                <QrScanner
                    onScan={onScan}
                    title='Scan Battery QR'
                    description='Point camera at battery QR code'
                />
            </View>

            <View className='mt-4 flex-1 px-4'>
                <View className='mb-2 flex-row items-center justify-between'>
                    <Text className='text-xs font-bold uppercase tracking-[1px] text-neutral-400'>
                        Scanned Batteries
                    </Text>
                    <View className='rounded-full bg-amber-100 px-2.5 py-0.5'>
                        <Text className='text-xs font-bold text-amber-600'>{scannedBatteries.length}</Text>
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
                            iconColor='#D97706'
                            iconBgClass='bg-amber-50'
                        />
                    ))}
                    {scannedBatteries.length === 0 && (
                        <Text className='py-4 text-center text-sm text-neutral-400'>No batteries scanned yet</Text>
                    )}
                </ScrollView>
            </View>

            <View className='border-t border-neutral-100 bg-white px-4 py-4'>
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
