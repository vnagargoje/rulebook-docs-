import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Text, View } from '@/components/ui'

type Props = {
    title: string
    subtitle: string
    time: string
    type: 'swap' | 'inward' | 'outward'
}

export function RecentActivityItem({ title, subtitle, time, type }: Props) {
    const getTheme = () => {
        switch (type) {
            case 'swap':
                return {
                    icon: 'sync',
                    color: '#0AAAB6',
                    bgColor: 'bg-primary-50',
                }
            case 'inward':
                return {
                    icon: 'tray-arrow-down',
                    color: '#10B981',
                    bgColor: 'bg-success-50',
                }
            case 'outward':
                return {
                    icon: 'tray-arrow-up',
                    color: '#F59E0B',
                    bgColor: 'bg-warning-50',
                }
            default:
                return {
                    icon: 'circle-outline',
                    color: '#64748B',
                    bgColor: 'bg-neutral-100',
                }
        }
    }

    const theme = getTheme()

    return (
        <View className='flex-row items-center gap-4 p-4'>
            <View className={`h-11 w-11 items-center justify-center rounded-xl ${theme.bgColor}`}>
                <MaterialCommunityIcons name={theme.icon as any} size={22} color={theme.color} />
            </View>
            <View className='flex-1'>
                <Text className='text-[13px] font-bold text-neutral-900'>{title}</Text>
                <Text className='mt-0.5 text-[11px] font-medium text-neutral-500'>{subtitle}</Text>
            </View>
            <View className='items-end'>
                <Text className='text-[10px] font-semibold text-neutral-400'>{time}</Text>
            </View>
        </View>
    )
}
