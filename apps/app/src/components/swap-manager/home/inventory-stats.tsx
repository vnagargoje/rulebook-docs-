import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Text, View } from '@/components/ui'

type StatProps = {
    label: string
    value: string | number
    icon: keyof typeof MaterialCommunityIcons.glyphMap
    color: string
    bgColor: string
}

function StatItem({ label, value, icon, color, bgColor }: StatProps) {
    return (
        <View className='flex-1 rounded-3xl bg-white p-4 shadow-sm border border-neutral-100'>
            <View className={`h-10 w-10 items-center justify-center rounded-2xl ${bgColor}`}>
                <MaterialCommunityIcons name={icon} size={20} color={color} />
            </View>
            <View className='mt-4'>
                <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                    {label}
                </Text>
                <Text className='mt-1 text-xl font-bold text-neutral-900'>{value}</Text>
            </View>
        </View>
    )
}

type Props = {
    available: number
    drained: number
    isLoading?: boolean
}

export function InventoryStats({ available, drained, isLoading }: Props) {
    return (
        <View className='flex-row gap-4 px-4'>
            <StatItem
                label='Available Batteries'
                value={isLoading ? '–' : available}
                icon='battery-high'
                color='#10B981'
                bgColor='bg-success-50'
            />
            <StatItem
                label='Drained Batteries'
                value={isLoading ? '–' : drained}
                icon='battery-outline'
                color='#EF4444'
                bgColor='bg-red-50'
            />
        </View>
    )
}
