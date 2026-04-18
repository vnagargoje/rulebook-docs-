import { Text, View } from '@/components/ui'
import type { CustomerProfileHeroCardProps } from '@/types/customer/customer-profile.types'

export function CustomerProfileHeroCard({
    eyebrow,
    title,
    description,
    statusLabel,
    phoneLabel,
    phoneValue,
}: CustomerProfileHeroCardProps) {
    return (
        <View className='rounded-[28px] bg-[#0F172A] p-5'>
            <View className='flex-row items-start justify-between gap-4'>
                <View className='flex-1'>
                    <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-[#8EA0BE]'>
                        {eyebrow}
                    </Text>
                    <Text className='mt-3 text-3xl font-bold text-white'>{title}</Text>
                    <Text className='mt-3 text-sm leading-6 text-[#CBD5E1]'>{description}</Text>
                </View>
                <View className='rounded-full bg-white/10 px-3 py-1'>
                    <Text className='text-xs font-semibold text-white'>{statusLabel}</Text>
                </View>
            </View>

            <View className='mt-5 rounded-2xl bg-white/5 p-4'>
                <Text className='text-sm font-medium text-[#CBD5E1]'>{phoneLabel}</Text>
                <Text className='mt-1 text-xl font-semibold text-white'>{phoneValue}</Text>
            </View>
        </View>
    )
}
