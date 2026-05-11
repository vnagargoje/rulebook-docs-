import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Text, View } from '@/components/ui'

interface KycBadgeProps {
    label: string
    status: string | null | undefined
}

export function KycBadge({ label, status }: KycBadgeProps) {
    const ok = status === 'approved' || status === 'verified'
    const pending = status === 'pending' || status === 'submitted'
    const bg = ok ? 'bg-green-50' : pending ? 'bg-amber-50' : 'bg-neutral-100'
    const text = ok ? 'text-green-700' : pending ? 'text-amber-700' : 'text-neutral-400'
    const icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'] = ok
        ? 'check-circle'
        : pending
          ? 'clock-outline'
          : 'alert-circle-outline'
    const iconColor = ok ? '#15803D' : pending ? '#B45309' : '#9CA3AF'
    const displayStatus = ok ? 'Verified' : pending ? 'Pending' : 'Not submitted'

    return (
        <View className={`flex-1 items-center rounded-2xl ${bg} px-2 py-3`}>
            <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
            <Text className={`mt-1.5 text-[10px] font-bold uppercase tracking-[0.6px] ${text}`}>
                {label}
            </Text>
            <Text className={`mt-0.5 text-[10px] font-medium ${text}`}>{displayStatus}</Text>
        </View>
    )
}
