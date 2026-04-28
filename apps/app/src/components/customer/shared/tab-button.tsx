import { Pressable, Text, View } from '@/components/ui'

type Props = {
    label: string
    isActive: boolean
    onPress: () => void
}

export function TabButton({ label, isActive, onPress }: Props) {
    return (
        <Pressable onPress={onPress} className='flex-1'>
            <View
                className={`items-center rounded-xl py-3 ${isActive ? 'bg-primary-600' : 'bg-transparent'}`}>
                <Text className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                    {label}
                </Text>
            </View>
        </Pressable>
    )
}
