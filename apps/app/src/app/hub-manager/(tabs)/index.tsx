import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Pressable } from 'react-native'

import { SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { RefreshControl } from 'react-native'
import { InventoryStats } from '@/components/hub-manager/home'
import { useIsAuthenticated } from '@/queries/auth.query'
import { useStationBatteryCounts } from '@/queries/swap-manager/batteries.query'

interface ActionTileProps {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']
    iconBg: string
    iconColor: string
    title: string
    description: string
    onPress: () => void
}

function ActionTile({ icon, iconBg, iconColor, title, description, onPress }: ActionTileProps) {
    return (
        <Pressable
            onPress={onPress}
            className='flex-row items-center gap-4 rounded-3xl border border-neutral-100 bg-white p-4 active:opacity-70'>
            <View
                className='h-14 w-14 items-center justify-center rounded-2xl'
                style={{ backgroundColor: iconBg }}>
                <MaterialCommunityIcons
                    name={icon}
                    size={28}
                    color={iconColor}
                />
            </View>
            <View className='flex-1'>
                <Text className='text-base font-bold text-neutral-900'>{title}</Text>
                <Text className='mt-0.5 text-xs leading-5 text-neutral-500'>{description}</Text>
            </View>
            <MaterialCommunityIcons
                name='chevron-right'
                size={20}
                color='#D1D5DB'
            />
        </Pressable>
    )
}

export default function HubManagerHomeScreen() {
    const router = useRouter()

    const { data: auth } = useIsAuthenticated()
    const managerId = auth?.userId ?? ''

    const { data: batteryCounts, isLoading: batteryCountsLoading, refetch: refetchCounts } = useStationBatteryCounts({
        variables: { managerId },
        enabled: !!managerId,
    })

    const handleRefresh = useCallback(() => {
        refetchCounts()
    }, [refetchCounts])

    const handleInward = useCallback(() => {
        router.push('/hub-manager/battery-inward')
    }, [router])

    const handleOutward = useCallback(() => {
        router.push('/hub-manager/battery-outward')
    }, [router])

    return (
        <SafeAreaView
            className='flex-1 bg-neutral-50'
            edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={handleRefresh}
                    />
                }
                contentContainerStyle={{ paddingBottom: 40 }}>
                <View className='gap-6'>
                    <View className='px-4 pt-4'>
                        <Text className='text-[11px] font-semibold uppercase tracking-[1.5px] text-neutral-400'>
                            Hub Station Manager
                        </Text>
                        <Text className='mt-0.5 text-2xl font-bold text-neutral-900'>Hub Dashboard</Text>
                        <View className='mt-2 flex-row items-center gap-1.5'>
                            <View className='h-2 w-2 rounded-full bg-primary-500' />
                            <Text className='text-sm font-medium text-neutral-600'>Battery Operations</Text>
                        </View>
                    </View>

                    <View className='gap-3'>
                        <View className='px-4'>
                            <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                                Inventory Status
                            </Text>
                        </View>
                        <InventoryStats
                            charged={batteryCounts?.charged ?? 0}
                            charging={batteryCounts?.charging ?? 0}
                            inTransit={batteryCounts?.inTransit ?? 0}
                            isLoading={batteryCountsLoading}
                        />
                    </View>

                    <View className='px-4 gap-3'>
                        <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400'>
                            Operations
                        </Text>
                        <ActionTile
                            icon='battery-arrow-down-outline'
                            iconBg='#EFF6FF'
                            iconColor='#2563EB'
                            title='Battery Inward'
                            description='Receive drained batteries from arriving transport vehicles'
                            onPress={handleInward}
                        />
                        <ActionTile
                            icon='battery-arrow-up-outline'
                            iconBg='#F0FDF4'
                            iconColor='#16A34A'
                            title='Battery Outward'
                            description='Dispatch charged batteries to swap stations'
                            onPress={handleOutward}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
