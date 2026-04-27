import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'
import { Text } from '@/components/ui'
import { BatteryStatus, STATUS_CONFIG } from '@/data/swap-manager/battery-status-config.data'

interface Props {
    status: BatteryStatus
}

export function BatteryStatusBadge({ status }: Props) {
    const config = STATUS_CONFIG[status]

    return (
        <View className={`flex-row items-center gap-1 rounded-xl px-2.5 py-1 ${config.bg}`}>
            <MaterialCommunityIcons
                name={config.icon as any}
                size={13}
                color={config.iconColor}
            />
            <Text className={`text-[11px] font-bold ${config.text}`}>{config.label}</Text>
        </View>
    )
}
