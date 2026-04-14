import yugoLogo from '../../../../assets/yugo-logo.png'
import { Button, Text, View } from '@/components/ui'
import { Image } from '@/components/ui'

type HeroCardProps = {
    onPrimaryPress: () => void
    onSecondaryPress: () => void
}

export function HeroCard( { onPrimaryPress, onSecondaryPress }: HeroCardProps ) {
    return (
        <View className='overflow-hidden rounded-[28px] bg-primary-600 px-5 pb-5 pt-6'>
            <View className='absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary-500/25' />
            <View className='absolute right-12 top-16 h-20 w-20 rounded-full bg-warning-300/25' />

            <View className='gap-4'>
                <Image
                    source={yugoLogo}
                    contentFit='contain'
                    className='h-24 w-44 self-start'
                />

                <View className='gap-3'>
                    <Text className='max-w-[280px] text-[32px] font-bold leading-10 text-white'>
                        Swap, save, and stay ride-ready every day.
                    </Text>
                    <Text className='max-w-[300px] text-sm leading-6 text-neutral-200'>
                        Track your booking, battery health, and support access from one Yugo-branded first screen.
                    </Text>
                </View>

                <View className='mt-2 gap-3'>
                    <Button
                        label='Open booking'
                        onPress={onPrimaryPress}
                        className='h-12 rounded-xl bg-warning-500'
                        textClassName='text-base font-semibold text-white'
                    />
                    <Button
                        label='Get support'
                        variant='outline'
                        onPress={onSecondaryPress}
                        className='h-12 rounded-xl border-white/25 bg-white/5'
                        textClassName='text-base font-semibold text-white'
                    />
                </View>
            </View>
        </View>
    )
}
