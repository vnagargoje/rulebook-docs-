import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { StatTile } from '@/components/customer/shared'
import { Pressable, Text, View } from '@/components/ui'
import { formatCurrencyIN, formatNumberIN, formatPercentage, getAmountDifference } from '@/lib/formatters/customer'
import type { TopUp } from '@/queries/customer'

type Props = {
    topUp: TopUp
    onPress: () => void
}

export function TopUpCard({ topUp, onPress }: Props) {
    const gstAmount = getAmountDifference(topUp.totalAmount, topUp.price)

    return (
        <Pressable onPress={onPress}>
            <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                <View className='flex-row items-start justify-between'>
                    <View className='flex-1 pr-3'>
                        <Text className='text-lg font-bold text-neutral-900'>{topUp.name}</Text>
                    </View>
                    <View className='items-end'>
                        <Text className='text-xl font-bold text-primary-600'>
                            {formatCurrencyIN(topUp.totalAmount)}
                        </Text>
                        <Text className='text-[10px] text-neutral-400'>incl. GST</Text>
                    </View>
                </View>

                <View className='mt-4 flex-row gap-3'>
                    <StatTile label='KM Added' value={`+${formatNumberIN(topUp.kmLimit)} km`} tint='success' />
                    <StatTile label='Base Price' value={formatCurrencyIN(topUp.price)} />
                    <StatTile label={`GST (${formatPercentage(topUp.gstPercentage)})`} value={formatCurrencyIN(gstAmount)} tint='primary' />
                </View>

                <View className='mt-3 flex-row items-center justify-end gap-1'>
                    <Text className='text-sm font-semibold text-primary-600'>Apply top-up</Text>
                    <MaterialCommunityIcons name='chevron-right' size={16} color='#2563EB' />
                </View>
            </View>
        </Pressable>
    )
}
