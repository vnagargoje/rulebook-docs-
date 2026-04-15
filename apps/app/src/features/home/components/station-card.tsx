import type { StationCardProps } from './home-component.types'
import { Text, View } from '@/components/ui'

export function StationCard({ station }: StationCardProps) {
    return (
        <View className='rounded-3xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900'>
            <View className='flex-row items-start justify-between gap-4'>
                <View className='flex-1 gap-1'>
                    <Text className='text-lg font-semibold text-neutral-900 dark:text-neutral-50'>{station.name}</Text>
                    <Text className='text-sm text-neutral-500 dark:text-neutral-400'>{station.distance}</Text>
                </View>
                <View className='rounded-full bg-success-100 px-3 py-1 dark:bg-success-900/40'>
                    <Text className='text-xs font-semibold text-success-700 dark:text-success-300'>Open now</Text>
                </View>
            </View>

            <View className='mt-4 gap-2 rounded-2xl bg-neutral-100 p-3 dark:bg-neutral-800'>
                <Text className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>
                    {station.availability}
                </Text>
                <Text className='text-sm text-neutral-500 dark:text-neutral-400'>{station.eta}</Text>
            </View>
        </View>
    )
}
