import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native'
import { useCallback, useState } from 'react'
import { useRouter } from 'expo-router'
import { ScreenLoader, Text } from '@/components/ui'
import { useBatteries } from '@/queries/swap-manager/batteries.query'
import { useIsAuthenticated } from '@/queries/auth.query'
import { useDebounce } from '@/lib/hooks'
import { BatteryListHeader } from '@/components/swap-manager/batteries/list-header'
import { Search } from '@/components/ui/search'
import { EmptyState } from '@/components/ui/empty'
import { BatteryCard } from '@/components/swap-manager/batteries/card'
import { ErrorView } from '@/components/ui/error'

export default function BatteriesScreen() {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search)
    const { data: managerId } = useIsAuthenticated({
        select: (data) => data?.userId ?? '',
    })

    const {
        data,
        isLoading,
        isError,
        refetch,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useBatteries({
        variables: { managerId: managerId ?? '', search: debouncedSearch },
        enabled: !!managerId,
    })

    const allBatteries = data?.pages?.flatMap((page) => page.data ?? []) ?? []
    const total = data?.pages?.[0]?.meta.totalItems ?? 0

    const handleEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const handleBatteryPress = useCallback(
        (id: string) => {
            router.push({ pathname: '/swap-manager/battery/[id]', params: { id } })
        },
        [router],
    )

    if (isLoading) return <ScreenLoader />
    if (isError) return <ErrorView onRetry={refetch} />

    return (
        <SafeAreaView
            className='flex-1 bg-neutral-50'
            edges={['top']}>
            <FlatList
                data={allBatteries}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                    />
                }
                ListHeaderComponent={
                    <View>
                        <BatteryListHeader total={total} />
                        <Search
                            value={search}
                            onChangeText={setSearch}
                            resultCount={total}
                        />
                    </View>
                }
                ListEmptyComponent={
                    <EmptyState
                        icon='battery-off-outline'
                        title='No Batteries found'
                        description='Batteries assigned to your station will appear here'
                    />
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className='items-center py-6'>
                            <ActivityIndicator size='small' color='#9CA3AF' />
                        </View>
                    ) : !hasNextPage && allBatteries.length > 0 ? (
                        <View className='items-center py-6'>
                            <Text className='text-xs text-neutral-400'>All batteries loaded</Text>
                        </View>
                    ) : null
                }
                renderItem={({ item }) => (
                    <BatteryCard
                        battery={item}
                        onPress={() => handleBatteryPress(item.id)}
                    />
                )}
            />
        </SafeAreaView>
    )
}
