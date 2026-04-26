import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import { SafeAreaView, Text, View } from '@/components/ui'

interface TransportActionCardProps {
    title: string
    subtitle: string
    iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name']
    iconColor: string
    iconBgClass: string
    onPress: () => void
}

function TransportActionCard({ title, subtitle, iconName, iconColor, iconBgClass, onPress }: TransportActionCardProps) {
    return (
        <Pressable
            onPress={onPress}
            className='flex-1 rounded-3xl border border-neutral-100 bg-white p-5 active:opacity-70'>
            <View className={`mb-3 h-12 w-12 items-center justify-center rounded-2xl ${iconBgClass}`}>
                <MaterialCommunityIcons
                    name={iconName}
                    size={24}
                    color={iconColor}
                />
            </View>
            <Text className='text-sm font-bold text-neutral-900'>{title}</Text>
            <Text className='mt-1 text-xs leading-4 text-neutral-400'>{subtitle}</Text>
        </Pressable>
    )
}

export default function InventoryScreen() {
    const router = useRouter()

    return (
        <SafeAreaView
            className='flex-1 bg-neutral-50'
            edges={['top']}>
            <View className='px-4 pb-3 pt-6'>
                <Text className='text-[11px] font-semibold uppercase tracking-[1.5px] text-neutral-400'>
                    Battery Transport
                </Text>
                <Text className='mt-0.5 text-2xl font-bold text-neutral-900'>Inventory</Text>
            </View>

            <View className='flex-row gap-4 px-4 pt-2'>
                <TransportActionCard
                    title='Send to Hub'
                    subtitle='Dispatch batteries to a hub station'
                    iconName='battery-arrow-up-outline'
                    iconColor='#D97706'
                    iconBgClass='bg-amber-50'
                    onPress={() => router.push('/swap-manager/battery-outward')}
                />
                <TransportActionCard
                    title='Receive from Hub'
                    subtitle='Receive incoming batteries from hub'
                    iconName='battery-arrow-down-outline'
                    iconColor='#059669'
                    iconBgClass='bg-emerald-50'
                    onPress={() => router.push('/swap-manager/battery-inward')}
                />
            </View>
        </SafeAreaView>
    )
}
