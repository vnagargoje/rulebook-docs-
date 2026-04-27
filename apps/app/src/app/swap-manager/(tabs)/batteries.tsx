import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, View } from 'react-native'
import { useMemo, useState } from 'react'
import { ScreenLoader, Text } from '@/components/ui'
import { useAuthStore } from '@/stores/auth.store'
import { useBatteries } from '@/queries/swap-manager/batteries.query'
import { useIsAuthenticated } from '@/queries/auth.query'
import { BatteryListHeader } from '@/components/swap-manager/batteries/list-header'
import { Search } from '@/components/ui/search'
import { EmptyState } from '@/components/ui/empty'
import { BatteryCard } from '@/components/swap-manager/batteries/card'
import { ErrorView } from '@/components/ui/error'

export default function BatteriesScreen() {
    const [search, setSearch] = useState('')
    const { data: managerId } = useIsAuthenticated({
        select: (data) => data.userId,
    })
    const { data, isLoading, isError, refetch } = useBatteries({
        variables: { managerId: managerId ?? '' },
    })

    const filtered = useMemo(() => {
        if (!data?.data) return []
        if (!search.trim()) return data.data
        const q = search.trim().toLowerCase()
        return data.data.filter((b) => b.batteryQrId.toLowerCase().includes(q))
    }, [data?.data, search])

    if (isLoading) return <ScreenLoader />
    if (isError) return <ErrorView onRetry={refetch} />

    return (
        <SafeAreaView
            className='flex-1 bg-neutral-50'
            edges={['top']}>
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                ListHeaderComponent={
                    <View>
                        <BatteryListHeader total={data?.meta.totalItems ?? 0} />
                        <Search
                            value={search}
                            onChangeText={setSearch}
                            resultCount={filtered.length}
                        />
                    </View>
                }
                ListEmptyComponent={
                    <EmptyState
                        icon='map-marker-off-outline'
                        title='No Batteries found'
                        description='Batteries assigned to you will appear here'
                    />
                }
                renderItem={({ item }) => <BatteryCard battery={item} />}
            />
        </SafeAreaView>
    )
}
