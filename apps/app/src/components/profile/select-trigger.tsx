import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable, ViewStyle } from 'react-native'

import { Text } from '@/components/ui'

interface SelectTriggerProps {
    value?: string
    placeholder: string
    disabled?: boolean
    onPress: () => void
}

export function SelectTrigger({ value, placeholder, disabled, onPress }: SelectTriggerProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[selectTriggerStyle, disabled ? { opacity: 0.5 } : undefined]}>
            <Text
                style={{
                    color: value ? '#111827' : '#C4C9D4',
                    fontSize: 15,
                    flex: 1,
                }}>
                {value || placeholder}
            </Text>
            <MaterialCommunityIcons name='chevron-down' size={18} color='#9CA3AF' />
        </Pressable>
    )
}

export const inputStyle = {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111827',
}

const selectTriggerStyle: ViewStyle = {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
}
