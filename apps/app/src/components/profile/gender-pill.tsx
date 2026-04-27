import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'
import { Text } from '@/components/ui'

interface GenderPillProps {
    label: string
    icon: string
    isActive: boolean
    onPress: () => void
}

export function GenderPill({ label, icon, isActive, onPress }: GenderPillProps) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                flex: 1,
                height: 52,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                borderRadius: 14,
                backgroundColor: isActive ? '#EFF6FF' : '#F9FAFB',
                borderWidth: 1.5,
                borderColor: isActive ? '#2563EB' : '#E5E7EB',
            }}>
            <MaterialCommunityIcons name={icon as any} size={16} color={isActive ? '#2563EB' : '#9CA3AF'} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: isActive ? '#2563EB' : '#6B7280' }}>{label}</Text>
        </Pressable>
    )
}
