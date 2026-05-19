import { useLocalSearchParams } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { getBookingStatusMeta } from '@/data/customer/booking-status.data'
import { InfoRow } from '@/components/customer/booking-detail'
import { Image, ScreenLoader, ScrollView, Text, View } from '@/components/ui'
import { formatCurrencyIN, formatDateIN, formatNumberIN, formatTimeIN } from '@/lib/formatters/customer'
import { useBookingById } from '@/queries/customer'
import { useGetBatteryById } from '@/queries/hub-manager'
import { CircularSoc } from '@/components/customer/home'
import { STATUS_CONFIG } from '@/data/swap-manager/battery-status-config.data'
import { BatteryPropertyRow } from '@/components/swap-manager/batteries/property-row'
import type { V1BatteriesGetOneBatteryResponse } from '@/services/api/codegen/Api'

type BatteryProperties = NonNullable<V1BatteriesGetOneBatteryResponse['properties']>

export default function BookingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { data: booking, isLoading } = useBookingById({ variables: { id: id! } })
    const { data: batteryDetail } = useGetBatteryById({
        variables: { id: booking?.battery?.id ?? '' },
        enabled: !!booking?.battery?.id,
    })

    const meta = booking ? getBookingStatusMeta(booking.status) : null

    if (isLoading || !booking || !meta) {
        return <ScreenLoader label='Loading booking...' />
    }

    const createdDate = formatDateIN(booking.createdAt)
    const createdTime = formatTimeIN(booking.createdAt)
    const kmLimit =
        Number(booking.userPlan?.totalKm) ||
        booking.userPlan?.plan?.kmLimit ||
        Number((booking.userPlan?.planSnapshot as any)?.kmLimit ?? 0)
    const validityDays =
        booking.userPlan?.plan?.validityDays ?? (booking.userPlan?.planSnapshot as any)?.validityDays ?? null
    const planSnapshot = (booking.userPlan?.planSnapshot as any) ?? {}
    const topUps = (booking.userPlan?.topUps ?? []) as Array<{
        id: string
        status: string
        appliedAt: string | null
        topUpSnapshot: Record<string, any> | null
    }>
    const totalAmount = planSnapshot.totalAmount ?? (booking.userPlan?.plan as any)?.totalAmount ?? null
    const planPrice = planSnapshot.price ?? (booking.userPlan?.plan as any)?.price ?? null
    const registrationFee = planSnapshot.registrationFee ?? null
    const gstPercentage = planSnapshot.gstPercentage ?? (booking.userPlan?.plan as any)?.gstPercentage ?? null
    const hasFinancials = totalAmount != null || planPrice != null

    const batteryProperties = (batteryDetail?.properties ?? {}) as BatteryProperties
    const hasBatterySoc = batteryDetail != null
    const hasBatteryIot = batteryDetail != null && (batteryProperties.socPercent != null || batteryProperties.latitude != null || batteryProperties.speed != null)
    const hasBatterySpecs = batteryDetail != null && (batteryProperties.capacity || batteryProperties.range || batteryProperties.chargingTime || batteryProperties.lifecycle || batteryProperties.weight || batteryProperties.warranty)

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
                    {['created', 'ongoing'].includes(booking.status) && !booking.vehicle && (
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

                    {/* Full battery health card */}
                    {hasBatterySoc && batteryDetail && (
                        <View className='overflow-hidden rounded-[28px] bg-[#080E1C]'>
                            {/* Header */}
                            <View className='flex-row items-center justify-between border-b border-white/[0.07] px-5 py-4'>
                                <View className='flex-row items-center gap-2.5'>
                                    <View className='h-9 w-9 items-center justify-center rounded-xl bg-white/[0.07]'>
                                        <MaterialCommunityIcons name='battery-heart-variant' size={18} color='#34D399' />
                                    </View>
                                    <Text className='text-sm font-bold text-white'>Battery Health</Text>
                                </View>
                                {(() => {
                                    const cfg = STATUS_CONFIG[batteryDetail.status]
                                    return (
                                        <View className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${cfg.bg}`}>
                                            <MaterialCommunityIcons name={cfg.icon as any} size={11} color={cfg.iconColor} />
                                            <Text className={`text-[11px] font-bold ${cfg.text}`}>{cfg.label}</Text>
                                        </View>
                                    )
                                })()}
                            </View>

                            <View className='px-5 py-5'>
                                {/* SOC row */}
                                <View className='flex-row items-center gap-5'>
                                    {batteryProperties.socPercent != null ? (
                                        <CircularSoc percent={batteryProperties.socPercent} size={84} strokeWidth={8} />
                                    ) : (
                                        <View className='h-[84px] w-[84px] items-center justify-center rounded-full border-[8px] border-[#1E293B]'>
                                            <MaterialCommunityIcons name='battery-unknown' size={30} color='#475569' />
                                        </View>
                                    )}
                                    <View className='flex-1 gap-2'>
                                        <Text className='text-[10px] font-semibold uppercase tracking-[1.5px] text-[#8EA0BE]'>
                                            Battery ID
                                        </Text>
                                        <Text className='text-sm font-bold tracking-wider text-white'>
                                            {batteryDetail.batteryQrId}
                                        </Text>
                                        {batteryDetail.gpsId ? (
                                            <View className='flex-row items-center gap-1.5'>
                                                <MaterialCommunityIcons name='crosshairs-gps' size={12} color='#A78BFA' />
                                                <Text className='text-xs text-[#8EA0BE]'>{batteryDetail.gpsId}</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </View>

                                {/* Quick stats */}
                                {(batteryProperties.capacity || batteryProperties.range || batteryProperties.speed != null) && (
                                    <View className='mt-4 flex-row gap-2'>
                                        {batteryProperties.capacity && (
                                            <View className='flex-1 items-center rounded-2xl bg-white/[0.05] py-3'>
                                                <MaterialCommunityIcons name='battery-high' size={16} color='#34D399' />
                                                <Text className='mt-1 text-xs font-bold text-white'>{batteryProperties.capacity}</Text>
                                                <Text className='text-[10px] text-[#8EA0BE]'>Capacity</Text>
                                            </View>
                                        )}
                                        {batteryProperties.range && (
                                            <View className='flex-1 items-center rounded-2xl bg-white/[0.05] py-3'>
                                                <MaterialCommunityIcons name='map-marker-distance' size={16} color='#60A5FA' />
                                                <Text className='mt-1 text-xs font-bold text-white'>{batteryProperties.range}</Text>
                                                <Text className='text-[10px] text-[#8EA0BE]'>Range</Text>
                                            </View>
                                        )}
                                        {batteryProperties.speed != null && (
                                            <View className='flex-1 items-center rounded-2xl bg-white/[0.05] py-3'>
                                                <MaterialCommunityIcons name='speedometer' size={16} color='#F59E0B' />
                                                <Text className='mt-1 text-xs font-bold text-white'>{batteryProperties.speed}</Text>
                                                <Text className='text-[10px] text-[#8EA0BE]'>km/h</Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                {/* Location */}
                                {batteryProperties.latitude != null && batteryProperties.longitude != null && (
                                    <View className='mt-3 flex-row items-center gap-2 rounded-2xl bg-white/[0.05] px-4 py-3'>
                                        <MaterialCommunityIcons name='map-marker-outline' size={15} color='#A78BFA' />
                                        <Text className='text-xs text-[#8EA0BE]'>
                                            {Number(batteryProperties.latitude).toFixed(5)},{' '}
                                            {Number(batteryProperties.longitude).toFixed(5)}
                                        </Text>
                                    </View>
                                )}

                                {/* Specs */}
                                {hasBatterySpecs && (
                                    <View className='mt-4 gap-2'>
                                        <Text className='text-[10px] font-semibold uppercase tracking-[1.2px] text-[#8EA0BE]'>
                                            Specifications
                                        </Text>
                                        <View className='gap-2'>
                                            {batteryProperties.chargingTime ? (
                                                <BatteryPropertyRow icon='lightning-bolt' iconColor='#D97706' iconBg='#FEF3C7' label='Charging Time' value={batteryProperties.chargingTime} />
                                            ) : null}
                                            {batteryProperties.lifecycle ? (
                                                <BatteryPropertyRow icon='refresh' iconColor='#059669' iconBg='#D1FAE5' label='Lifecycle' value={batteryProperties.lifecycle} />
                                            ) : null}
                                            {batteryProperties.weight ? (
                                                <BatteryPropertyRow icon='weight' iconColor='#6B7280' iconBg='#F3F4F6' label='Weight' value={batteryProperties.weight} />
                                            ) : null}
                                            {batteryProperties.warranty ? (
                                                <BatteryPropertyRow icon='shield-check-outline' iconColor='#2563EB' iconBg='#EFF6FF' label='Warranty' value={batteryProperties.warranty} />
                                            ) : null}
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {hasFinancials && (
                        <View className='overflow-hidden rounded-[28px] bg-white shadow-sm'>
                            <View className='border-b border-neutral-100 px-5 py-4'>
                                <View className='flex-row items-center gap-3'>
                                    <View className='h-10 w-10 items-center justify-center rounded-xl bg-success-50'>
                                        <MaterialCommunityIcons name='receipt' size={20} color='#16A34A' />
                                    </View>
                                    <Text className='text-sm font-bold text-neutral-900'>Payment Summary</Text>
                                </View>
                            </View>
                            <View className='px-5 py-4 gap-3'>
                                {planPrice != null && (
                                    <View className='flex-row items-center justify-between'>
                                        <Text className='text-sm text-neutral-500'>Plan Price</Text>
                                        <Text className='text-sm font-semibold text-neutral-900'>{formatCurrencyIN(planPrice)}</Text>
                                    </View>
                                )}
                                {registrationFee != null && Number(registrationFee) > 0 && (
                                    <View className='flex-row items-center justify-between'>
                                        <Text className='text-sm text-neutral-500'>Registration Fee</Text>
                                        <Text className='text-sm font-semibold text-neutral-900'>{formatCurrencyIN(registrationFee)}</Text>
                                    </View>
                                )}
                                {gstPercentage != null && (
                                    <View className='flex-row items-center justify-between'>
                                        <Text className='text-sm text-neutral-500'>GST</Text>
                                        <Text className='text-sm font-semibold text-neutral-900'>{gstPercentage}%</Text>
                                    </View>
                                )}
                                {totalAmount != null && (
                                    <>
                                        <View className='border-t border-neutral-100' />
                                        <View className='flex-row items-center justify-between'>
                                            <Text className='text-sm font-bold text-neutral-900'>Total Paid</Text>
                                            <Text className='text-base font-bold text-success-700'>{formatCurrencyIN(totalAmount)}</Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    )}

                    {topUps.length > 0 && (
                        <View className='overflow-hidden rounded-[28px] bg-white shadow-sm'>
                            <View className='border-b border-neutral-100 px-5 py-4'>
                                <View className='flex-row items-center justify-between'>
                                    <View className='flex-row items-center gap-3'>
                                        <View className='h-10 w-10 items-center justify-center rounded-xl bg-primary-50'>
                                            <MaterialCommunityIcons name='lightning-bolt' size={20} color='#2563EB' />
                                        </View>
                                        <Text className='text-sm font-bold text-neutral-900'>Top-up History</Text>
                                    </View>
                                    <View className='rounded-full bg-primary-50 px-2.5 py-1'>
                                        <Text className='text-xs font-bold text-primary-700'>{topUps.length}</Text>
                                    </View>
                                </View>
                            </View>
                            <View className='gap-3 px-5 py-4'>
                                {topUps.map((topUp) => {
                                    const snap = topUp.topUpSnapshot ?? {}
                                    const extraKm = Number(snap.extraKm ?? snap.kmLimit ?? 0)
                                    const isApplied = topUp.status === 'applied'
                                    return (
                                        <View
                                            key={topUp.id}
                                            className={`rounded-2xl border px-4 py-4 ${
                                                isApplied
                                                    ? 'border-success-100 bg-success-50'
                                                    : topUp.status === 'awaiting'
                                                    ? 'border-warning-100 bg-warning-50'
                                                    : 'border-red-100 bg-red-50'
                                            }`}>
                                            <View className='flex-row items-start justify-between gap-3'>
                                                <View className='flex-1'>
                                                    <Text className='text-sm font-bold text-neutral-900'>
                                                        {snap.name ?? 'Top-up'}
                                                    </Text>
                                                    {isApplied && topUp.appliedAt ? (
                                                        <Text className='mt-0.5 text-xs text-neutral-500'>
                                                            Applied {formatDateIN(topUp.appliedAt)}
                                                        </Text>
                                                    ) : (
                                                        <Text className='mt-0.5 text-xs text-neutral-500 capitalize'>
                                                            {topUp.status}
                                                        </Text>
                                                    )}
                                                </View>
                                                <View className='items-end gap-1'>
                                                    {snap.price != null && (
                                                        <Text className='text-sm font-bold text-neutral-900'>
                                                            {formatCurrencyIN(snap.price)}
                                                        </Text>
                                                    )}
                                                    {isApplied && extraKm > 0 && (
                                                        <View className='rounded-full bg-success-100 px-2.5 py-0.5'>
                                                            <Text className='text-[11px] font-bold text-success-700'>
                                                                +{formatNumberIN(extraKm)} km
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
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
