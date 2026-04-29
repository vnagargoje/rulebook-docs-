import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Text, View } from '@/components/ui'

type Props = {
    icon: string
    label: string
    value: string
}

export function InfoRow({ icon, label, value }: Props) {
    return (
        <View className='flex-row items-center gap-4 py-3.5'>
            <View className='h-9 w-9 items-center justify-center rounded-xl bg-primary-50'>
                <MaterialCommunityIcons name={icon as any} size={18} color='#2563EB' />
            </View>
            <View className='flex-1'>
                <Text className='text-xs text-neutral-500'>{label}</Text>
                <Text className='mt-0.5 text-[15px] font-semibold text-neutral-900'>{value}</Text>
            </View>
        </View>
    )
}
