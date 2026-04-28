import { Text } from '@/components/ui'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'

interface Props {
    total: number
}

export function BatteryListHeader({ total }: Props) {
    return (
        <View className='mx-4 mb-4 mt-2 overflow-hidden rounded-[28px] bg-[#0B1220] px-5 pb-5 pt-5'>
            <View className='absolute -right-10 -top-8 h-32 w-32 rounded-full bg-cyan-400/20' />
            <View className='absolute -left-8 bottom-8 h-24 w-24 rounded-full bg-primary-500/10' />

            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-[#8EA0BE]'>Inventory</Text>
            <View className='mt-3 flex-row items-center gap-4'>
                <View className='h-14 w-14 items-center justify-center rounded-full bg-white/15'>
                    <MaterialCommunityIcons
                        name='battery-charging'
                        size={26}
                        color='#60A5FA'
                    />
                </View>
                <View className='flex-1'>
                    <Text className='text-2xl font-bold text-white'>{total}</Text>
                    <Text className='mt-0.5 text-sm text-[#A9B8CE]'>Batteries assigned</Text>
                </View>
            </View>
        </View>
    )
}
