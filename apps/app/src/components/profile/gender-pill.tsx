import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'
import { Text } from '@/components/ui'

interface GenderPillProps {
    label: string
    icon: string
    isActive: boolean
    disabled?: boolean
    onPress: () => void
}

export function GenderPill({ label, icon, isActive, disabled, onPress }: GenderPillProps) {
    return (
        <Pressable
            onPress={disabled ? undefined : onPress}
            style={{
                flex: 1,
                height: 52,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                borderRadius: 14,
                backgroundColor: disabled ? (isActive ? '#E5E7EB' : '#F3F4F6') : (isActive ? '#EFF6FF' : '#F9FAFB'),
                borderWidth: 1.5,
                borderColor: disabled ? (isActive ? '#9CA3AF' : '#E5E7EB') : (isActive ? '#2563EB' : '#E5E7EB'),
            }}>
            <MaterialCommunityIcons name={icon as any} size={16} color={disabled ? (isActive ? '#6B7280' : '#9CA3AF') : (isActive ? '#2563EB' : '#9CA3AF')} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: disabled ? (isActive ? '#4B5563' : '#9CA3AF') : (isActive ? '#2563EB' : '#6B7280') }}>{label}</Text>
        </Pressable>
    )
}
