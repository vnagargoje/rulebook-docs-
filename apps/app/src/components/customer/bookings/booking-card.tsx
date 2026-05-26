import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Pressable, Text, View } from '@/components/ui'
import { getBookingStatusConfig } from '@/data/customer/booking-status.data'
import { formatDateIN, formatNumberIN } from '@/lib/formatters/customer'
import type { Booking } from '@/queries/customer'

type Props = {
    booking: Booking
    onPress: () => void
}

export function BookingCard({ booking, onPress }: Props) {
    const statusConfig = getBookingStatusConfig(booking.status)
    const showOtp = ['created', 'ongoing'].includes(booking.status) && !booking.vehicle

    return (
        <Pressable onPress={onPress}>
            <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                <View className='flex-row items-start justify-between'>
                    <View className='flex-1'>
                        <Text className='text-lg font-bold text-neutral-900'>
                            {booking.userPlan?.plan?.name ?? (booking.userPlan?.planSnapshot as any)?.name ?? 'Plan'}
                        </Text>
                        <View className='mt-1.5 flex-row items-center gap-1.5'>
                            <MaterialCommunityIcons name='map-marker-outline' size={14} color='#9CA3AF' />
                            <Text className='text-sm text-neutral-500'>
                                {booking.station?.name ?? 'Pickup station pending'}
                            </Text>
                        </View>
                    </View>
                    <View className={`rounded-full px-3 py-1.5 ${statusConfig.bg}`}>
                        <Text className={`text-xs font-bold ${statusConfig.text}`}>
                            {statusConfig.label}
                        </Text>
                    </View>
                </View>

                <View className='mt-4 flex-row gap-3'>
                    {showOtp && (
                        <View className='flex-1 rounded-2xl border border-primary-100 bg-primary-50 p-3'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-primary-500'>
                                Pickup OTP
                            </Text>
                            <Text className='mt-1 text-xl font-black tracking-[4px] text-primary-700'>
                                {booking.pickupOtp}
                            </Text>
                        </View>
                    )}
                    <View className='flex-1 rounded-2xl bg-neutral-50 p-3'>
                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                            Booked on
                        </Text>
                        <Text className='mt-1 text-sm font-semibold text-neutral-800'>
                            {formatDateIN(booking.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Text>
                    </View>
                    {!showOtp && (
                        <View className='flex-1 rounded-2xl bg-neutral-50 p-3'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                Remaining KM
                            </Text>
                            <Text className='mt-1 text-sm font-semibold text-neutral-800'>
                                {formatNumberIN(Number(booking.userPlan?.remainingKm ?? 0))} km
                            </Text>
                        </View>
                    )}
                </View>

                <View className='mt-3 flex-row items-center justify-end gap-1'>
                    <Text className='text-sm font-semibold text-primary-600'>View details</Text>
                    <MaterialCommunityIcons name='chevron-right' size={16} color='#2563EB' />
                </View>
            </View>
        </Pressable>
    )
}
