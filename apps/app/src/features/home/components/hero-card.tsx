import { Button, Text, View } from '@/components/ui'

type HeroCardProps = {
    onPrimaryPress: () => void
    onSecondaryPress: () => void
}

export function HeroCard( { onPrimaryPress, onSecondaryPress }: HeroCardProps ) {
    return (
        <View className='overflow-hidden rounded-[28px] bg-neutral-950 px-5 pb-5 pt-6 dark:bg-neutral-900'>
            <View className='absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary-500/25' />
            <View className='absolute right-12 top-16 h-20 w-20 rounded-full bg-[#00ADB1]/20' />

            <View className='gap-4'>
                <View className='self-start rounded-full bg-white/10 px-3 py-1'>
                    <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-white'>Yugo mobility</Text>
                </View>

                <View className='gap-3'>
                    <Text className='max-w-[260px] text-[32px] font-bold leading-10 text-white'>
                        Swap-ready rides built for every city day.
                    </Text>
                    <Text className='max-w-[300px] text-sm leading-6 text-neutral-200'>
                        Track your active booking, battery range, and nearest swap station from one responsive home base.
                    </Text>
                </View>

                <View className='mt-2 gap-3'>
                    <Button
                        label='Open settings'
                        onPress={onPrimaryPress}
                        className='h-12 rounded-xl bg-primary-500'
                        textClassName='text-base font-semibold text-white'
                    />
                    <Button
                        label='View style guide'
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
