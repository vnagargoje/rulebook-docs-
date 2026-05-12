import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Text, View } from '@/components/ui'

interface InfoRowProps {
    label: string
    value?: string | null
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']
}

export function InfoRow({ label, value, icon }: InfoRowProps) {
    return (
        <View className='mb-3 flex-row items-start gap-3'>
            <View className='mt-0.5 h-8 w-8 items-center justify-center rounded-xl bg-neutral-50'>
                <MaterialCommunityIcons name={icon} size={16} color='#9CA3AF' />
            </View>
            <View className='flex-1'>
                <Text className='text-[11px] font-semibold uppercase tracking-[0.8px] text-neutral-400'>
                    {label}
                </Text>
                <Text className='mt-0.5 text-[14px] font-medium text-neutral-900'>
                    {value || <Text className='text-neutral-300'>—</Text>}
                </Text>
            </View>
        </View>
    )
}
