import { Text, View } from '@/components/ui'
import { useGetBatteryById } from '@/queries/battery.query'

interface BatteryQrChipProps {
    batteryId: string
}

export function BatteryQrChip({ batteryId }: BatteryQrChipProps) {
    const { data, isLoading } = useGetBatteryById({
        variables: { id: batteryId },
        enabled: !!batteryId,
    })

    return (
        <View className='rounded-lg bg-neutral-100 px-2 py-1'>
            <Text className='text-[10px] font-medium text-neutral-600'>
                {isLoading ? '...' : (data?.batteryQrId ?? batteryId)}
            </Text>
        </View>
    )
}
