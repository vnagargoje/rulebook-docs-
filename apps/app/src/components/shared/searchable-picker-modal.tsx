import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Modal,
    Pressable,
    TextInput,
    type ListRenderItemInfo,
} from 'react-native'

import { SafeAreaView, Text, View } from '@/components/ui'
import colors from '@/components/ui/colors'

export type PickerItem = {
    id: string
    name: string
}

interface SearchablePickerModalProps {
    visible: boolean
    title: string
    items: PickerItem[]
    isLoading: boolean
    isFetchingMore?: boolean
    hasNextPage?: boolean
    onClose: () => void
    onSelect: (item: PickerItem) => void
    onEndReached?: () => void
    onSearch: (query: string) => void
    searchValue: string
    selectedId?: string
    placeholder?: string
}

export function SearchablePickerModal({
    visible,
    title,
    items,
    isLoading,
    isFetchingMore,
    hasNextPage,
    onClose,
    onSelect,
    onEndReached,
    onSearch,
    searchValue,
    selectedId,
    placeholder = 'Search…',
}: SearchablePickerModalProps) {
    const searchRef = useRef<TextInput>(null)

    const [localSearch, setLocalSearch] = useState(searchValue)

    useEffect(() => {
        if (visible) {
            setLocalSearch(searchValue)
            setTimeout(() => searchRef.current?.focus(), 300)
        }
    }, [visible, searchValue])

    const handleSearchChange = useCallback(
        (text: string) => {
            setLocalSearch(text)
            onSearch(text)
        },
        [onSearch],
    )

    const handleClear = useCallback(() => {
        setLocalSearch('')
        onSearch('')
        searchRef.current?.focus()
    }, [onSearch])

    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<PickerItem>) => {
            const isSelected = item.id === selectedId
            return (
                <Pressable
                    onPress={() => {
                        Keyboard.dismiss()
                        onSelect(item)
                    }}
                    className={`flex-row items-center justify-between px-4 py-3.5 border-b border-neutral-50 ${
                        isSelected ? 'bg-primary-50' : 'bg-white'
                    }`}>
                    <Text
                        className={`text-[15px] ${
                            isSelected ? 'font-semibold text-primary-700' : 'font-normal text-neutral-900'
                        }`}>
                        {item.name}
                    </Text>
                    {isSelected && (
                        <MaterialCommunityIcons name='check-circle' size={18} color={colors.primary[600]} />
                    )}
                </Pressable>
            )
        },
        [onSelect, selectedId],
    )

    const renderFooter = useCallback(() => {
        if (isFetchingMore) {
            return (
                <View className='items-center py-4'>
                    <ActivityIndicator size='small' color={colors.primary[600]} />
                </View>
            )
        }
        if (!hasNextPage && items.length > 0) {
            return (
                <View className='items-center py-4'>
                    <Text className='text-xs text-neutral-400'>All results loaded</Text>
                </View>
            )
        }
        return null
    }, [isFetchingMore, hasNextPage, items.length])

    const renderEmpty = useCallback(() => {
        if (isLoading) return null
        return (
            <View className='flex-1 items-center justify-center py-12'>
                <MaterialCommunityIcons name='magnify-close' size={36} color='#D1D5DB' />
                <Text className='mt-3 text-sm text-neutral-400'>No results found</Text>
                {localSearch.length > 0 && (
                    <Text className='mt-1 text-xs text-neutral-400'>Try a different search</Text>
                )}
            </View>
        )
    }, [isLoading, localSearch.length])

    return (
        <Modal
            visible={visible}
            animationType='slide'
            presentationStyle='pageSheet'
            onRequestClose={onClose}>
            <SafeAreaView edges={['top', 'bottom']} className='flex-1 bg-white'>
                {/* Header */}
                <View className='flex-row items-center justify-between border-b border-neutral-100 px-4 py-3'>
                    <Text className='text-base font-bold text-neutral-900'>{title}</Text>
                    <Pressable onPress={onClose} className='px-2 py-1'>
                        <Text className='text-sm font-semibold text-primary-600'>Cancel</Text>
                    </Pressable>
                </View>

                {/* Search bar */}
                <View className='border-b border-neutral-100 px-4 py-3'>
                    <View className='flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5'>
                        <MaterialCommunityIcons name='magnify' size={18} color='#9CA3AF' />
                        <TextInput
                            ref={searchRef}
                            value={localSearch}
                            onChangeText={handleSearchChange}
                            placeholder={placeholder}
                            placeholderTextColor='#9CA3AF'
                            className='flex-1 text-[15px] text-neutral-900'
                            autoCapitalize='words'
                            autoCorrect={false}
                            returnKeyType='search'
                        />
                        {localSearch.length > 0 && (
                            <Pressable onPress={handleClear} className='p-0.5'>
                                <MaterialCommunityIcons name='close-circle' size={18} color='#9CA3AF' />
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* List */}
                {isLoading && items.length === 0 ? (
                    <View className='flex-1 items-center justify-center'>
                        <ActivityIndicator size='large' color={colors.primary[600]} />
                        <Text className='mt-3 text-sm text-neutral-400'>Loading…</Text>
                    </View>
                ) : (
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        ListEmptyComponent={renderEmpty}
                        ListFooterComponent={renderFooter}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.4}
                        keyboardShouldPersistTaps='handled'
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={20}
                    />
                )}
            </SafeAreaView>
        </Modal>
    )
}
