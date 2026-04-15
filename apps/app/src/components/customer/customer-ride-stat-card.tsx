import type { CustomerRideStatCardProps } from './customer-card.types'
import { Text, View } from '@/components/ui'

export function CustomerRideStatCard({ stat, width }: CustomerRideStatCardProps) {
    return (
        <View
            style={{ width }}
            className='min-h-28 rounded-3xl bg-neutral-950 p-4'>
            <Text className='text-xs font-medium uppercase tracking-[1.2px] text-neutral-400'>{stat.label}</Text>
            <Text className='mt-3 text-2xl font-bold text-white'>{stat.value}</Text>
            <Text className='mt-2 text-sm leading-6 text-neutral-300'>{stat.hint}</Text>
        </View>
    )
}
