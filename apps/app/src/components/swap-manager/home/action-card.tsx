import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Pressable, Text, View } from '@/components/ui'

type Props = {
    onPress: () => void
}

export function ActionCard({ onPress }: Props) {
    return (
        <Pressable onPress={onPress}>
            <View className='overflow-hidden rounded-3xl bg-[#080E1C] p-6'>
                <View className='flex-row items-center justify-between'>
                    <View className='h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10'>
                        <MaterialCommunityIcons name='qrcode-scan' size={24} color='#60A5FA' />
                    </View>
                    <MaterialCommunityIcons name='chevron-right' size={24} color='#475569' />
                </View>

                <View className='mt-6'>
                    <Text className='text-2xl font-bold text-white'>Execute Swap</Text>
                    <Text className='mt-1 text-sm text-[#94A3B8]'>
                        Scan customer QR code to start battery replacement process
                    </Text>
                </View>

                <View className='mt-6 flex-row items-center gap-2 rounded-2xl bg-white/[0.05] p-4'>
                    <View className='h-2 w-2 rounded-full bg-success-500' />
                    <Text className='text-xs font-medium text-success-400'>System Online & Ready</Text>
                </View>
            </View>
        </Pressable>
    )
}
