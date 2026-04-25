import { SwapCard } from '@/components/swap-manager/swap-history/card'
import { SwapListFooter } from '@/components/swap-manager/swap-history/list-footer'
import { SwapHistoryHeader } from '@/components/swap-manager/swap-history/list-header'
import { ScreenLoader } from '@/components/ui'
import { EmptyState } from '@/components/ui/empty'
import { ErrorView } from '@/components/ui/error'
import { useIsAuthenticated } from '@/queries/auth.query'
import { useSwapHistory } from '@/queries/swap-manager/swap-history.query'
import { useMemo } from 'react'
import { FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SwapHistoryScreen() {
    const { data: managerId } = useIsAuthenticated({
        select(data) {
            return data?.userId ?? ''
        },
    })
    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useSwapHistory({
        variables: { managerId: managerId ?? '' },
        enabled: !!managerId,
    })

    const swaps = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data])
    const total = data?.pages[0]?.meta.totalItems ?? 0

    if (isLoading) return <ScreenLoader />
    if (isError) return <ErrorView onRetry={refetch} />

    return (
        <SafeAreaView
            className='flex-1 bg-neutral-50'
            edges={['top']}>
            <FlatList
                data={swaps}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
                }}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={<SwapHistoryHeader total={total} />}
                ListEmptyComponent={
                    <EmptyState
                        icon='swap-horizontal'
                        title='No swaps yet'
                        description='Battery swaps you perform will appear here'
                    />
                }
                ListFooterComponent={
                    <SwapListFooter
                        isFetchingNextPage={isFetchingNextPage}
                        hasNextPage={!!hasNextPage}
                    />
                }
                renderItem={({ item }) => <SwapCard swap={item} />}
            />
        </SafeAreaView>
    )
}
