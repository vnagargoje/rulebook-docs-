import { SectionHeading } from '@/components/section-heading'
import { swapManagerContent, swapManagerMetrics } from '@/data/swap-manager/swap-manager.data'
import { FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'

export default function SwapManagerScreen() {
    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <SectionHeading {...swapManagerContent.heading} />

                        <View className='rounded-[28px] bg-[#0F172A] p-5'>
                            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-[#8EA0BE]'>
                                {swapManagerContent.hero.eyebrow}
                            </Text>
                            <Text className='mt-3 text-3xl font-bold text-white'>{swapManagerContent.hero.title}</Text>
                            <Text className='mt-3 text-sm leading-6 text-[#CBD5E1]'>
                                {swapManagerContent.hero.description}
                            </Text>
                        </View>

                        <View className='gap-3'>
                            {swapManagerMetrics.map((item) => (
                                <View
                                    key={item.id}
                                    className='rounded-3xl border border-neutral-200 bg-white p-4'>
                                    <Text className='text-xs font-semibold uppercase tracking-[1.2px] text-primary-600'>
                                        {item.title}
                                    </Text>
                                    <Text className='mt-2 text-3xl font-bold text-neutral-900'>{item.value}</Text>
                                    <Text className='mt-2 text-sm leading-6 text-neutral-500'>{item.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
