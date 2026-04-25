import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'
import { Text } from '@/components/ui'
import { SwapBatteryRow } from './battery-row'
import { SwapUserRow } from './swap-user'
import { V1BatterySwapsGetSwapHistoryResponse } from '@/services/api/codegen/Api'

interface Props {
    swap: V1BatterySwapsGetSwapHistoryResponse['data'][0]
}

function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

function formatTime(iso: string) {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}

export function SwapCard({ swap }: Props) {
    return (
        <View className='mx-4 mb-3 rounded-3xl border border-neutral-200 bg-white p-4 gap-3'>
            <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center gap-1.5'>
                    <MaterialCommunityIcons
                        name='calendar-outline'
                        size={13}
                        color='#9CA3AF'
                    />
                    <Text className='text-xs font-semibold text-neutral-500'>{formatDate(swap.createdAt)}</Text>
                </View>
                <View className='flex-row items-center gap-1.5'>
                    <MaterialCommunityIcons
                        name='clock-outline'
                        size={13}
                        color='#9CA3AF'
                    />
                    <Text className='text-xs text-neutral-400'>{formatTime(swap.createdAt)}</Text>
                </View>
            </View>

            <View className='flex-row items-center gap-2'>
                <SwapBatteryRow
                    label='Removed'
                    batteryQrId={swap.oldBattery?.batteryQrId}
                    variant='old'
                />
                <View className='h-8 w-8 items-center justify-center rounded-full bg-neutral-100'>
                    <MaterialCommunityIcons
                        name='arrow-right'
                        size={16}
                        color='#6B7280'
                    />
                </View>
                <SwapBatteryRow
                    label='Installed'
                    batteryQrId={swap.newBattery?.batteryQrId}
                    variant='new'
                />
            </View>

            <View className='flex-row gap-2'>
                <View className='flex-row items-center gap-1 rounded-lg bg-neutral-100 px-2 py-1'>
                    <MaterialCommunityIcons
                        name='bookmark-outline'
                        size={11}
                        color='#6B7280'
                    />
                    <Text
                        className='text-[11px] text-neutral-500'
                        numberOfLines={1}>
                        {swap.bookingId.slice(0, 8)}…
                    </Text>
                </View>
                <View className='flex-row items-center gap-1 rounded-lg bg-neutral-100 px-2 py-1'>
                    <MaterialCommunityIcons
                        name='car-outline'
                        size={11}
                        color='#6B7280'
                    />
                    <Text
                        className='text-[11px] text-neutral-500'
                        numberOfLines={1}>
                        {swap.vehicleId.slice(0, 8)}…
                    </Text>
                </View>
            </View>

            {swap.userPlan?.user && (
                <SwapUserRow
                    firstName={swap.userPlan.user.firstName}
                    lastName={swap.userPlan.user.lastName}
                    mobile={swap.userPlan.user.mobilenumber}
                />
            )}
        </View>
    )
}
