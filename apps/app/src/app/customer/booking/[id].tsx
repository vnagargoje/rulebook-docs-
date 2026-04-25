import { useLocalSearchParams } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { getBookingStatusMeta } from '@/data/customer/booking-status.data'
import { InfoRow } from '@/components/customer/booking-detail'
import { Image, ScreenLoader, ScrollView, Text, View } from '@/components/ui'
import { formatDateIN, formatNumberIN, formatTimeIN } from '@/lib/formatters/customer'
import { useBookingById } from '@/queries/customer'

export default function BookingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { data: booking, isLoading } = useBookingById({ variables: { id: id! } })

    const meta = booking ? getBookingStatusMeta(booking.status) : null

    if (isLoading || !booking || !meta) {
        return <ScreenLoader label='Loading booking...' />
    }

    const createdDate = formatDateIN(booking.createdAt)
    const createdTime = formatTimeIN(booking.createdAt)
    const kmLimit = booking.userPlan?.plan?.kmLimit ?? Number((booking.userPlan?.planSnapshot as any)?.kmLimit ?? 0)
    const validityDays =
        booking.userPlan?.plan?.validityDays ?? (booking.userPlan?.planSnapshot as any)?.validityDays ?? null

    return (
        <View className='flex-1 bg-neutral-50'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}>
                <View className='overflow-hidden bg-[#080E1C] px-5 pb-8 pt-6'>
                    <View
                        className='absolute -right-12 -top-12 h-44 w-44 rounded-full'
                        style={{ backgroundColor: `${meta.accent}18` }}
                    />
                    <View
                        className='absolute -left-10 bottom-4 h-32 w-32 rounded-full'
                        style={{ backgroundColor: `${meta.accent}0D` }}
                    />

                    <View className='flex-row items-center justify-between'>
                        <View className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${meta.badgeBg}`}>
                            <MaterialCommunityIcons
                                name={meta.icon as any}
                                size={13}
                                color={meta.iconColor}
                            />
                            <Text className={`text-xs font-bold uppercase tracking-[1px] ${meta.badgeText}`}>
                                {meta.label}
                            </Text>
                        </View>
                        <Text className='text-xs text-[#5A6A82]'>
                            {createdDate} · {createdTime}
                        </Text>
                    </View>

                    <Text className='mt-5 text-3xl font-bold text-white'>
                        {booking.userPlan?.plan?.name ?? (booking.userPlan?.planSnapshot as any)?.name ?? 'Plan'}
                    </Text>

                    {/* Vehicle number pill (when assigned) */}
                    {booking.vehicle?.vehicleNumber ? (
                        <View className='mt-3 flex-row items-center gap-2'>
                            <MaterialCommunityIcons
                                name='motorbike'
                                size={15}
                                color='#8EA0BE'
                            />
                            <Text className='text-sm font-semibold text-[#8EA0BE]'>
                                {booking.vehicle.vehicleNumber}
                            </Text>
                        </View>
                    ) : null}

                    <View className='mt-5 flex-row gap-3'>
                        <View className='flex-1 rounded-2xl bg-white/[0.06] px-4 py-4'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1.2px] text-[#5A6A82]'>
                                KM Left
                            </Text>
                            <Text className='mt-1.5 text-xl font-bold text-white'>
                                {formatNumberIN(Number(booking.userPlan?.remainingKm ?? 0))}
                                <Text className='text-sm font-normal text-[#8EA0BE]'> km</Text>
                            </Text>
                        </View>
                        {kmLimit ? (
                            <View className='flex-1 rounded-2xl bg-white/[0.06] px-4 py-4'>
                                <Text className='text-[10px] font-semibold uppercase tracking-[1.2px] text-[#5A6A82]'>
                                    KM Limit
                                </Text>
                                <Text className='mt-1.5 text-xl font-bold text-white'>
                                    {formatNumberIN(kmLimit)}
                                    <Text className='text-sm font-normal text-[#8EA0BE]'> km</Text>
                                </Text>
                            </View>
                        ) : null}
                        {validityDays ? (
                            <View className='flex-1 rounded-2xl bg-white/[0.06] px-4 py-4'>
                                <Text className='text-[10px] font-semibold uppercase tracking-[1.2px] text-[#5A6A82]'>
                                    Validity
                                </Text>
                                <Text className='mt-1.5 text-xl font-bold text-white'>
                                    {validityDays}
                                    <Text className='text-sm font-normal text-[#8EA0BE]'> days</Text>
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                <View className='gap-4 px-4 pt-4'>
                    {['created', 'ongoing'].includes(booking.status) && (
                        <View className='overflow-hidden rounded-[28px] bg-[#0F172A]'>
                            <View className='absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-600/10' />
                            <View className='px-5 pb-6 pt-5'>
                                <View className='flex-row items-center gap-2'>
                                    <MaterialCommunityIcons
                                        name='shield-key'
                                        size={18}
                                        color='#60A5FA'
                                    />
                                    <Text className='text-xs font-bold uppercase tracking-[1.6px] text-[#8EA0BE]'>
                                        Pickup OTP
                                    </Text>
                                </View>
                                <Text className='mt-4 text-center text-6xl font-black tracking-[12px] text-white'>
                                    {booking.pickupOtp}
                                </Text>
                                <View className='mt-4 rounded-2xl bg-white/[0.05] px-4 py-3'>
                                    <Text className='text-center text-xs leading-5 text-[#8EA0BE]'>
                                        Share this code with the station admin when collecting your vehicle
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {booking.userPlan?.qrCode?.path ? (
                        <View className='overflow-hidden rounded-[28px] bg-white shadow-sm'>
                            <View className='border-b border-neutral-100 px-5 py-4'>
                                <View className='flex-row items-center gap-3'>
                                    <View className='h-10 w-10 items-center justify-center rounded-xl bg-success-50'>
                                        <MaterialCommunityIcons
                                            name='qrcode-scan'
                                            size={20}
                                            color='#16A34A'
                                        />
                                    </View>
                                    <View>
                                        <Text className='text-sm font-bold text-neutral-900'>Plan QR Code</Text>
                                        <Text className='text-xs text-neutral-500'>Scan at the station</Text>
                                    </View>
                                </View>
                            </View>
                            <View className='items-center px-5 pb-5 pt-4'>
                                <View className='overflow-hidden rounded-[20px] border border-neutral-100 bg-neutral-50 p-5'>
                                    <Image
                                        source={{ uri: booking.userPlan.qrCode.path }}
                                        contentFit='contain'
                                        className='h-60 w-60'
                                    />
                                </View>
                                <Text className='mt-4 text-center text-xs leading-5 text-neutral-500'>
                                    Show this QR code for subscription verification and battery swap flow
                                </Text>
                            </View>
                        </View>
                    ) : null}

                    {!booking.vehicle && !booking.station && booking.status === 'created' && (
                        <View className='flex-row items-start gap-4 rounded-[28px] border border-dashed border-warning-300 bg-warning-50 px-5 py-5'>
                            <View className='mt-0.5 h-10 w-10 items-center justify-center rounded-xl bg-warning-100'>
                                <MaterialCommunityIcons
                                    name='clock-outline'
                                    size={20}
                                    color='#D97706'
                                />
                            </View>
                            <View className='flex-1'>
                                <Text className='text-sm font-bold text-warning-800'>Awaiting vehicle assignment</Text>
                                <Text className='mt-1 text-xs leading-5 text-warning-700'>
                                    The admin will assign your station, vehicle and battery shortly. You will see the
                                    details here once confirmed.
                                </Text>
                            </View>
                        </View>
                    )}

                    {booking.station && (
                        <View className='overflow-hidden rounded-[28px] bg-white shadow-sm'>
                            <View className='flex-row items-center gap-3 border-b border-neutral-100 px-5 py-4'>
                                <View className='h-10 w-10 items-center justify-center rounded-xl bg-warning-50'>
                                    <MaterialCommunityIcons
                                        name='map-marker'
                                        size={20}
                                        color='#D97706'
                                    />
                                </View>
                                <View className='flex-1'>
                                    <Text className='text-sm font-bold text-neutral-900'>Pickup Station</Text>
                                    <Text className='text-xs text-neutral-500'>Collect your vehicle here</Text>
                                </View>
                                {booking.station.active !== undefined && (
                                    <View
                                        className={`rounded-full px-3 py-1 ${
                                            booking.station.active ? 'bg-success-100' : 'bg-red-100'
                                        }`}>
                                        <Text
                                            className={`text-xs font-bold ${
                                                booking.station.active ? 'text-success-700' : 'text-red-700'
                                            }`}>
                                            {booking.station.active ? 'Open' : 'Closed'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View className='px-5 py-4'>
                                <Text className='text-lg font-bold text-neutral-900'>{booking.station.name}</Text>
                                <Text className='mt-1 text-xs capitalize text-neutral-500'>
                                    {booking.station.type} station
                                </Text>
                            </View>
                        </View>
                    )}

                    {(booking.vehicle || booking.battery) && (
                        <View className='flex-row gap-3'>
                            {booking.vehicle && (
                                <View className='flex-1 overflow-hidden rounded-[28px] bg-white shadow-sm'>
                                    <View className='border-b border-neutral-100 px-4 py-3.5'>
                                        <View className='flex-row items-center gap-2'>
                                            <View className='h-8 w-8 items-center justify-center rounded-xl bg-neutral-100'>
                                                <MaterialCommunityIcons
                                                    name='motorbike'
                                                    size={16}
                                                    color='#374151'
                                                />
                                            </View>
                                            <Text className='text-xs font-bold text-neutral-400'>Vehicle</Text>
                                        </View>
                                    </View>
                                    <View className='px-4 py-4'>
                                        {booking.vehicle.vehicleNumber ? (
                                            <>
                                                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                                    Number
                                                </Text>
                                                <Text className='mt-1 text-base font-bold text-neutral-900'>
                                                    {booking.vehicle.vehicleNumber}
                                                </Text>
                                            </>
                                        ) : null}
                                        {booking.vehicle.rcNumber ? (
                                            <View className='mt-2'>
                                                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                                    RC
                                                </Text>
                                                <Text className='mt-1 text-sm font-medium text-neutral-700'>
                                                    {booking.vehicle.rcNumber}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </View>
                            )}
                            {booking.battery && (
                                <View className='flex-1 overflow-hidden rounded-[28px] bg-white shadow-sm'>
                                    <View className='border-b border-neutral-100 px-4 py-3.5'>
                                        <View className='flex-row items-center gap-2'>
                                            <View className='h-8 w-8 items-center justify-center rounded-xl bg-success-50'>
                                                <MaterialCommunityIcons
                                                    name='battery-charging'
                                                    size={16}
                                                    color='#16A34A'
                                                />
                                            </View>
                                            <Text className='text-xs font-bold text-neutral-400'>Battery</Text>
                                        </View>
                                    </View>
                                    <View className='px-4 py-4'>
                                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                            ID
                                        </Text>
                                        <Text className='mt-1 text-base font-bold text-neutral-900'>
                                            {booking.battery.batteryQrId}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    <View className='overflow-hidden rounded-[28px] bg-white shadow-sm'>
                        <View className='px-5 py-5'>
                            <Text className='mb-2 text-xs font-bold uppercase tracking-[1.4px] text-neutral-400'>
                                Booking Info
                            </Text>
                            <InfoRow
                                icon='calendar-blank-outline'
                                iconColor='#2563EB'
                                iconBg='bg-primary-50'
                                label='Booking Date'
                                value={`${createdDate}, ${createdTime}`}
                            />
                            <View className='border-b border-neutral-100' />
                            <InfoRow
                                icon='identifier'
                                iconColor='#6B7280'
                                iconBg='bg-neutral-100'
                                label='Booking ID'
                                value={booking.id.slice(-12).toUpperCase()}
                            />
                            {booking.userPlan?.startsAt ? (
                                <>
                                    <View className='border-b border-neutral-100' />
                                    <InfoRow
                                        icon='play-circle-outline'
                                        iconColor='#16A34A'
                                        iconBg='bg-success-50'
                                        label='Plan Started'
                                        value={formatDateIN(booking.userPlan.startsAt)}
                                    />
                                </>
                            ) : null}
                            {booking.userPlan?.expiresAt ? (
                                <>
                                    <View className='border-b border-neutral-100' />
                                    <InfoRow
                                        icon='calendar-remove-outline'
                                        iconColor='#D97706'
                                        iconBg='bg-warning-50'
                                        label='Plan Expires'
                                        value={formatDateIN(booking.userPlan.expiresAt)}
                                    />
                                </>
                            ) : null}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
