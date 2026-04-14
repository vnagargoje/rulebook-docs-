import type { HomeRideStat } from '../home.types'
import type { DimensionValue } from 'react-native'
import { Text, View } from '@/components/ui'

type RideStatCardProps = {
    stat: HomeRideStat
    width: DimensionValue
}

export function RideStatCard( { stat, width }: RideStatCardProps ) {
    return (
        <View
            style={{ width }}
            className='min-h-28 rounded-3xl bg-neutral-950 p-4 dark:bg-neutral-900'>
            <Text className='text-xs font-medium uppercase tracking-[1.2px] text-neutral-400'>{stat.label}</Text>
            <Text className='mt-3 text-2xl font-bold text-white'>{stat.value}</Text>
            <Text className='mt-2 text-sm leading-6 text-neutral-300'>{stat.hint}</Text>
        </View>
    )
}
