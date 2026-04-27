import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Image, View } from 'react-native'
import { Text } from '@/components/ui'

interface Props {
    qrCode?: { id: string; path: string }
    batteryQrId: string
}

export function BatteryQrImage({ qrCode, batteryQrId }: Props) {
    return (
        <View className='items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50 p-3'>
            {qrCode?.path ? (
                <Image
                    source={{ uri: qrCode.path }}
                    className='h-20 w-20 rounded-lg'
                    resizeMode='contain'
                />
            ) : (
                <View className='h-20 w-20 items-center justify-center rounded-lg bg-neutral-100'>
                    <MaterialCommunityIcons
                        name='qrcode'
                        size={36}
                        color='#D1D5DB'
                    />
                </View>
            )}
            <Text className='mt-1.5 text-center text-[10px] font-bold tracking-wider text-neutral-400'>
                {batteryQrId}
            </Text>
        </View>
    )
}
