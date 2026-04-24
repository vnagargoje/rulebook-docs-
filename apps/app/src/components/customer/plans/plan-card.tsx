import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { StatTile } from '@/components/customer/shared'
import { Pressable, Text, View } from '@/components/ui'
import { formatCurrencyIN, formatKmIN } from '@/lib/formatters/customer'
import type { Plan } from '@/queries/customer'

type Props = {
    plan: Plan
    onPress: () => void
}

export function PlanCard({ plan, onPress }: Props) {
    const isPopular = plan.name.toLowerCase().includes('plus') || plan.price > 2000

    return (
        <Pressable onPress={onPress}>
            <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                <View className='flex-row items-start justify-between'>
                    <View className='flex-1 pr-3'>
                        <Text className='text-lg font-bold text-neutral-900'>{plan.name}</Text>
                        <View className='mt-1.5 flex-row items-center gap-1.5'>
                            <MaterialCommunityIcons name='lightning-bolt' size={13} color='#9CA3AF' />
                            <Text className='text-sm text-neutral-500'>Unlimited battery swaps</Text>
                        </View>
                    </View>
                    <View className='items-end'>
                        {isPopular && (
                            <View className='mb-1.5 rounded-full bg-primary-100 px-2.5 py-1'>
                                <Text className='text-[10px] font-bold text-primary-600'>Popular</Text>
                            </View>
                        )}
                        <Text className='text-xl font-bold text-primary-600'>
                            {formatCurrencyIN(plan.totalAmount)}
                        </Text>
                        <Text className='text-xs text-neutral-400'>total</Text>
                    </View>
                </View>

                <View className='mt-4 flex-row gap-3'>
                    <StatTile label='Validity' value={`${plan.validityDays} days`} />
                    <StatTile label='KM Limit' value={formatKmIN(plan.kmLimit)} />
                    <StatTile label='Deposit' value={formatCurrencyIN(plan.deposit)} />
                </View>

                <View className='mt-3 flex-row items-center justify-end gap-1'>
                    <Text className='text-sm font-semibold text-primary-600'>View details</Text>
                    <MaterialCommunityIcons name='chevron-right' size={16} color='#2563EB' />
                </View>
            </View>
        </Pressable>
    )
}
