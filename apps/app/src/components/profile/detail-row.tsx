import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Text, View } from '@/components/ui'

interface DetailRowProps {
    icon: string
    label: string
    value?: string | null
    placeholder?: string
}

export function DetailRow({ icon, label, value, placeholder }: DetailRowProps) {
    const isEmpty = !value
    return (
        <View className='flex-row items-center gap-3 py-3'>
            <View className='h-8 w-8 items-center justify-center rounded-xl bg-neutral-100'>
                <MaterialCommunityIcons name={icon as any} size={15} color='#9CA3AF' />
            </View>
            <View className='flex-1'>
                <Text className='text-[10px] font-semibold uppercase tracking-[0.8px] text-neutral-400'>{label}</Text>
                <Text className={`mt-0.5 text-[14px] font-semibold ${isEmpty ? 'italic text-neutral-300' : 'text-neutral-800'}`}>
                    {value || placeholder || 'Not added'}
                </Text>
            </View>
        </View>
    )
}
