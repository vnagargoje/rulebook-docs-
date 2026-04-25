import { Text } from '@/components/ui'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { TextInput, View } from 'react-native'

interface Props {
    value: string
    onChangeText: (text: string) => void
    resultCount: number
}

export function Search({ value, onChangeText, resultCount }: Props) {
    return (
        <View className='mx-4 mb-3'>
            <View className='flex-row items-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 gap-3'>
                <MaterialCommunityIcons
                    name='magnify'
                    size={20}
                    color='#9CA3AF'
                />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder='Search by QR ID...'
                    placeholderTextColor='#9CA3AF'
                    className='flex-1 text-sm text-neutral-900'
                    autoCapitalize='none'
                    autoCorrect={false}
                    clearButtonMode='while-editing'
                />
                {value.length > 0 && <Text className='text-xs text-neutral-400'>{resultCount} found</Text>}
            </View>
        </View>
    )
}
