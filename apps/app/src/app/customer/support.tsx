import { SectionHeading } from '@/components/section-heading'
import { customerSupportCards, customerSupportContent } from '@/data/customer/customer-support.data'
import { Button, FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'

export default function CustomerSupportScreen() {
    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <SectionHeading {...customerSupportContent.heading} />

                        <View className='rounded-[28px] border border-warning-200 bg-warning-50 p-5'>
                            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-warning-700'>
                                {customerSupportContent.priorityCard.eyebrow}
                            </Text>
                            <Text className='mt-3 text-3xl font-bold text-neutral-900'>
                                {customerSupportContent.priorityCard.title}
                            </Text>
                            <Text className='mt-3 text-sm leading-6 text-neutral-600'>
                                {customerSupportContent.priorityCard.description}
                            </Text>
                            <Button
                                label={customerSupportContent.priorityCard.actionLabel}
                                className='mt-5 h-12 rounded-xl bg-warning-500'
                                textClassName='text-base font-semibold text-white'
                            />
                        </View>

                        <View className='gap-3'>
                            {customerSupportCards.map((card) => (
                                <View
                                    key={card.id}
                                    className='rounded-3xl border border-neutral-200 bg-white p-4'>
                                    <Text className='text-lg font-semibold text-neutral-900'>{card.title}</Text>
                                    <Text className='mt-2 text-sm leading-6 text-neutral-500'>{card.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
