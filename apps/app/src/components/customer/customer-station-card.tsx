import { Text, View } from '@/components/ui'
import type { CustomerStationCardProps } from '@/types/customer/customer-home.types'

export function CustomerStationCard({ station }: CustomerStationCardProps) {
    return (
        <View className='rounded-3xl border border-neutral-200 bg-white p-4'>
            <View className='flex-row items-start justify-between gap-4'>
                <View className='flex-1 gap-1'>
                    <Text className='text-lg font-semibold text-neutral-900'>{station.name}</Text>
                    <Text className='text-sm text-neutral-500'>{station.distance}</Text>
                </View>
                <View className='rounded-full bg-success-100 px-3 py-1'>
                    <Text className='text-xs font-semibold text-success-700'>{station.statusLabel}</Text>
                </View>
            </View>

            <View className='mt-4 gap-2 rounded-2xl bg-neutral-100 p-3'>
                <Text className='text-sm font-medium text-neutral-900'>{station.availability}</Text>
                <Text className='text-sm text-neutral-500'>{station.eta}</Text>
            </View>
        </View>
    )
}
