import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Pressable, Text, View } from '@/components/ui'
import type { UserPlansResponse } from '@/queries/customer'

type UserPlanItem = UserPlansResponse['data'][number]

type Props = {
    plan: UserPlanItem
    onRecharge: () => void
}

export function ActivePlanCard({ plan, onRecharge }: Props) {
    const planName = (plan.planSnapshot as any)?.name ?? 'Plan'
    const topUpsKm = (plan.topUps as any[] ?? []).reduce(
        (sum: number, tu: any) => sum + (Number((tu.topUpSnapshot as any)?.kmLimit) || 0),
        0,
    )
    const planKm = Number((plan.planSnapshot as any)?.kmLimit) || 0
    const kmLimit = planKm + topUpsKm || Number(plan.remainingKm) || 1
    const remainingKm = Number(plan.remainingKm)
    const progressPct = Math.min(100, (remainingKm / kmLimit) * 100)
    const validityDays = (plan.planSnapshot as any)?.validityDays ?? '—'

    return (
        <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
            <View className='flex-row items-start justify-between'>
                <View className='flex-1 pr-3'>
                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                        Active Plan
                    </Text>
                    <Text className='mt-1 text-lg font-bold text-neutral-900'>{planName}</Text>
                </View>
                <View className='rounded-full bg-success-100 px-3 py-1'>
                    <Text className='text-xs font-bold text-success-700'>Active</Text>
                </View>
            </View>

            <View className='mt-4'>
                <View className='flex-row justify-between'>
                    <Text className='text-[11px] text-neutral-500'>
                        {remainingKm.toLocaleString('en-IN')} km remaining
                    </Text>
                    <Text className='text-[11px] font-semibold text-neutral-700'>
                        {kmLimit.toLocaleString('en-IN')} km total
                    </Text>
                </View>
                <View className='mt-2 h-2 overflow-hidden rounded-full bg-neutral-100'>
                    <View className='h-2 rounded-full bg-primary-500' style={{ width: `${progressPct}%` }} />
                </View>
            </View>

            <View className='mt-4 flex-row gap-2'>
                <View className='flex-1 rounded-2xl border border-primary-100 bg-primary-50 p-3'>
                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-primary-500'>
                        KM Left
                    </Text>
                    <Text className='mt-1 text-sm font-bold text-primary-800'>
                        {remainingKm.toLocaleString('en-IN')} km
                    </Text>
                </View>
                <View className='flex-1 rounded-2xl border border-neutral-100 bg-neutral-50 p-3'>
                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                        Validity
                    </Text>
                    <Text className='mt-1 text-sm font-bold text-neutral-900'>{validityDays} days</Text>
                </View>
            </View>

            <Pressable onPress={onRecharge} className='mt-4'>
                <View className='flex-row items-center justify-center gap-2 rounded-2xl bg-warning-500 py-3'>
                    <MaterialCommunityIcons name='lightning-bolt' size={16} color='#fff' />
                    <Text className='text-sm font-bold text-white'>Recharge Plan</Text>
                </View>
            </Pressable>

            {plan.topUps && plan.topUps.length > 0 && (
                <View className='mt-4'>
                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                        Applied Top-Ups ({plan.topUps.length})
                    </Text>
                    <View className='mt-2 gap-2'>
                        {(plan.topUps as any[]).map((tu: any) => {
                            const snap = tu.topUpSnapshot ?? {}
                            const km = snap.kmLimit ?? 0
                            const days = snap.validityDays ?? 0
                            const name = snap.name ?? 'Top-Up'
                            return (
                                <View
                                    key={tu.id}
                                    className='flex-row items-center gap-3 rounded-2xl border border-success-100 bg-success-50 px-3 py-2.5'>
                                    <View className='h-7 w-7 items-center justify-center rounded-xl bg-success-100'>
                                        <MaterialCommunityIcons
                                            name='lightning-bolt'
                                            size={14}
                                            color='#15803D'
                                        />
                                    </View>
                                    <View className='flex-1'>
                                        <Text className='text-[13px] font-semibold text-success-800'>
                                            {name}
                                        </Text>
                                        <Text className='mt-0.5 text-[11px] text-success-600'>
                                            +{Number(km).toLocaleString('en-IN')} km
                                            {days > 0 ? ` · +${days} days` : ''}
                                        </Text>
                                    </View>
                                    <Text className='text-[10px] text-neutral-400'>
                                        {new Date(tu.appliedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </Text>
                                </View>
                            )
                        })}
                    </View>
                </View>
            )}
        </View>
    )
}
