import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Pressable, Text, View } from '@/components/ui'
import type { Booking } from '@/queries/customer'

type Props = {
    booking: Booking
    onPress: () => void
}

export function ActiveBookingCard({ booking, onPress }: Props) {
    const planName = booking.userPlan?.plan?.name ?? (booking.userPlan?.planSnapshot as any)?.name ?? 'Plan'
    const isOngoing = booking.status === 'ongoing'
    const hasStation = Boolean(booking.station)

    return (
        <Pressable onPress={onPress}>
            <View className='overflow-hidden rounded-3xl bg-[#080E1C] p-5'>
                <View className='flex-row items-center justify-between'>
                    <View
                        className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${isOngoing ? 'bg-primary-500/20' : 'bg-success-500/20'}`}>
                        <MaterialCommunityIcons
                            name={isOngoing ? 'circle-slice-8' : 'check-circle-outline'}
                            size={12}
                            color={isOngoing ? '#60A5FA' : '#4ADE80'}
                        />
                        <Text
                            className={`text-xs font-bold ${isOngoing ? 'text-primary-400' : 'text-success-400'}`}>
                            {isOngoing ? 'Ongoing' : 'Booked'}
                        </Text>
                    </View>
                    <MaterialCommunityIcons name='chevron-right' size={18} color='#475569' />
                </View>

                <View className='mt-3'>
                    <Text className='text-2xl font-bold text-white'>{planName}</Text>
                    {hasStation && booking.station ? (
                        <View className='mt-1.5 flex-row items-center gap-1.5'>
                            <MaterialCommunityIcons name='map-marker-outline' size={14} color='#94A3B8' />
                            <Text className='text-sm text-[#94A3B8]'>{booking.station.name}</Text>
                        </View>
                    ) : (
                        <View className='mt-1.5 flex-row items-center gap-1.5'>
                            <MaterialCommunityIcons name='clock-outline' size={14} color='#FCD34D' />
                            <Text className='text-sm text-warning-300'>Awaiting vehicle assignment</Text>
                        </View>
                    )}
                </View>

                <View className='mt-4 rounded-2xl border border-white/10 bg-white/[0.04] py-4'>
                    <Text className='text-center text-[10px] font-semibold uppercase tracking-[2px] text-[#8EA0BE]'>
                        Pickup OTP
                    </Text>
                    <Text className='mt-2 text-center text-4xl font-black tracking-[10px] text-white'>
                        {booking.pickupOtp}
                    </Text>
                </View>

                <View className='mt-3 flex-row gap-2'>
                    <View className='flex-1 rounded-2xl bg-white/[0.05] p-3'>
                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-500'>
                            KM Left
                        </Text>
                        <Text className='mt-1 text-base font-bold text-white'>
                            {Number(booking.userPlan?.remainingKm ?? 0).toLocaleString('en-IN')} km
                        </Text>
                    </View>
                    <View className='flex-1 rounded-2xl bg-white/[0.05] p-3'>
                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-500'>
                            Validity
                        </Text>
                        <Text className='mt-1 text-base font-bold text-white'>
                            {booking.userPlan?.plan?.validityDays ??
                                (booking.userPlan?.planSnapshot as any)?.validityDays ??
                                '—'}{' '}
                            days
                        </Text>
                    </View>
                    {booking.vehicle && (
                        <View className='flex-1 rounded-2xl bg-white/[0.05] p-3'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-500'>
                                Vehicle
                            </Text>
                            <Text className='mt-1 text-sm font-bold text-white'>
                                {booking.vehicle.vehicleNumber ?? 'Assigned'}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    )
}
