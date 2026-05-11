import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable } from 'react-native'

import { Text } from '@/components/ui'
import colors from '@/components/ui/colors'

export function EditButton({ onPress }: { onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            className='flex-row items-center gap-1 rounded-xl bg-primary-50 px-3 py-1.5'>
            <MaterialCommunityIcons name='pencil-outline' size={13} color={colors.primary[600]} />
            <Text className='text-[12px] font-semibold text-primary-600'>Edit</Text>
        </Pressable>
    )
}
