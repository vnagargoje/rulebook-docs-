import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { FlatList, RefreshControl } from 'react-native'

import { PlanCard, TopUpCard } from '@/components/customer/plans'
import { TabButton } from '@/components/customer/shared'
import { SectionHeading } from '@/components/section-heading'
import { ActivityIndicator, SafeAreaView, Text, View } from '@/components/ui'
import { usePlans } from '@/queries/customer'
import { useTopUps } from '@/queries/customer'

type TabKey = 'plans' | 'topups'

export default function PlansScreen() {
    const router = useRouter()
    const params = useLocalSearchParams<{ tab?: string }>()
    const [activeTab, setActiveTab] = useState<TabKey>(params.tab === 'topups' ? 'topups' : 'plans')

    const {
        data: plansData,
        isLoading: plansLoading,
        refetch: refetchPlans,
        isRefetching: plansRefetching,
    } = usePlans()
    const {
        data: topUpsData,
        isLoading: topUpsLoading,
        refetch: refetchTopUps,
        isRefetching: topUpsRefetching,
    } = useTopUps()

    const plans = plansData?.data ?? []
    const topUps = topUpsData?.data ?? []

    const handleRefresh = useCallback(() => {
        refetchPlans()
        refetchTopUps()
    }, [refetchPlans, refetchTopUps])

    const handlePlanPress = useCallback(
        (planId: string) => {
            router.push({ pathname: '/customer/plan/[id]', params: { id: planId } })
        },
        [router],
    )

    const handleTopUpPress = useCallback(
        (topUpId: string) => {
            router.push({ pathname: '/customer/confirm-topup', params: { topUpId } })
        },
        [router],
    )

    return (
        <SafeAreaView className='flex-1 bg-background'>
            <FlatList
                data={activeTab === 'plans' ? plans : topUps}
                key={activeTab}
                keyExtractor={(item: any, index) => item?.id ?? `${activeTab}-${index}`}
                renderItem={({ item }) => {
                    if (!item?.id) return null
                    if (activeTab === 'plans') {
                        return (
                            <PlanCard
                                plan={item}
                                onPress={() => handlePlanPress(item.id)}
                            />
                        )
                    }

                    return (
                        <TopUpCard
                            topUp={item}
                            onPress={() => handleTopUpPress(item.id)}
                        />
                    )
                }}
                ItemSeparatorComponent={() => <View className='h-3' />}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={plansRefetching || topUpsRefetching}
                        onRefresh={handleRefresh}
                    />
                }
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
                ListHeaderComponent={
                    <View className='gap-6 pb-6'>
                        <SectionHeading
                            eyebrow='Plans & Top-Ups'
                            title='Power up your rides'
                            description='New plan or quick recharge — choose what works for you.'
                        />

                        <View className='flex-row rounded-2xl bg-neutral-100 p-1'>
                            <TabButton
                                label='Plans'
                                isActive={activeTab === 'plans'}
                                onPress={() => setActiveTab('plans')}
                            />
                            <TabButton
                                label='Top-Ups'
                                isActive={activeTab === 'topups'}
                                onPress={() => setActiveTab('topups')}
                            />
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    activeTab === 'plans' ? (
                        plansLoading ? (
                            <View className='items-center py-12'>
                                <ActivityIndicator size='large' />
                                <Text className='mt-3 text-sm text-neutral-500'>Loading plans...</Text>
                            </View>
                        ) : (
                            <View className='items-center rounded-3xl border border-neutral-200 bg-white py-12'>
                                <MaterialCommunityIcons
                                    name='package-variant'
                                    size={48}
                                    color='#D1D5DB'
                                />
                                <Text className='mt-4 text-lg font-semibold text-neutral-900'>No plans available</Text>
                                <Text className='mt-2 text-sm text-neutral-500'>Check back later for new plans</Text>
                            </View>
                        )
                    ) : topUpsLoading ? (
                        <View className='items-center py-12'>
                            <ActivityIndicator size='large' />
                            <Text className='mt-3 text-sm text-neutral-500'>Loading top-ups...</Text>
                        </View>
                    ) : (
                        <View className='items-center rounded-3xl border border-neutral-200 bg-white py-12'>
                            <MaterialCommunityIcons
                                name='battery-plus-outline'
                                size={48}
                                color='#D1D5DB'
                            />
                            <Text className='mt-4 text-lg font-semibold text-neutral-900'>No top-ups available</Text>
                            <Text className='mt-2 text-sm text-neutral-500'>Check back later for recharge options</Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    )
}
