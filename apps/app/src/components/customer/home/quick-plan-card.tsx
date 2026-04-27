import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Pressable, Text, View } from '@/components/ui'
import type { Plan } from '@/queries/customer'

type Props = {
    plan: Plan
    onPress: () => void
}

export function QuickPlanCard({ plan, onPress }: Props) {
    return (
        <Pressable onPress={onPress}>
            <View className='w-52 rounded-2xl border border-neutral-200 bg-white p-4'>
                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                    {plan.validityDays} days · {plan.kmLimit.toLocaleString('en-IN')} km
                </Text>
                <Text className='mt-1.5 text-base font-bold text-neutral-900'>{plan.name}</Text>
                <Text className='mt-3 text-xl font-bold text-primary-600'>
                    ₹{plan.totalAmount.toLocaleString('en-IN')}
                </Text>
                <View className='mt-3 flex-row items-center gap-1'>
                    <Text className='text-xs font-semibold text-primary-600'>View plan</Text>
                    <MaterialCommunityIcons name='chevron-right' size={14} color='#2563EB' />
                </View>
            </View>
        </Pressable>
    )
}
