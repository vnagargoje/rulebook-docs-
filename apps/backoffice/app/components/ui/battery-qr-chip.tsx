import { useGetBatteryById } from '~/queries/batteries'

interface BatteryQrChipProps {
    batteryId: string
}

export function BatteryQrChip({ batteryId }: BatteryQrChipProps) {
    const { data, isLoading } = useGetBatteryById(batteryId)

    return (
        <span className='inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200'>
            {isLoading ? '···' : (data?.batteryQrId ?? batteryId)}
        </span>
    )
}
