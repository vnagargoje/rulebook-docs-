import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'
import { Text } from '@/components/ui'

interface Props {
    firstName?: string
    lastName?: string
    mobile?: string
}

export function SwapUserRow({ firstName, lastName, mobile }: Props) {
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown User'

    return (
        <View className='flex-row items-center gap-2.5 border-t border-neutral-100 pt-3'>
            <View className='h-8 w-8 items-center justify-center rounded-full bg-primary-50'>
                <MaterialCommunityIcons
                    name='account-outline'
                    size={16}
                    color='#2563EB'
                />
            </View>
            <View className='flex-1'>
                <Text className='text-xs font-semibold text-neutral-800'>{fullName}</Text>
                {mobile && <Text className='text-[11px] text-neutral-400 mt-0.5'>{mobile}</Text>}
            </View>
        </View>
    )
}
