import { SectionHeading } from '@/components/section-heading'
import { hubManagerContent, hubManagerMetrics } from '@/data/hub-manager/hub-manager.data'
import { FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'

export default function HubManagerScreen() {
    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <SectionHeading {...hubManagerContent.heading} />

                        <View className='rounded-[28px] border border-primary-100 bg-primary-50 p-5'>
                            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-primary-700'>
                                {hubManagerContent.hero.eyebrow}
                            </Text>
                            <Text className='mt-3 text-3xl font-bold text-neutral-900'>
                                {hubManagerContent.hero.title}
                            </Text>
                            <Text className='mt-3 text-sm leading-6 text-neutral-600'>
                                {hubManagerContent.hero.description}
                            </Text>
                        </View>

                        <View className='gap-3'>
                            {hubManagerMetrics.map((item) => (
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
