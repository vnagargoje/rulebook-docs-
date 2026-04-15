import { SectionHeading } from '@/components/section-heading'
import { customerBookingContent, customerBookingSteps } from '@/data/customer/customer-booking.data'
import { Button, FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'

export default function CustomerBookingScreen() {
    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <SectionHeading {...customerBookingContent.heading} />

                        <View className='rounded-[28px] bg-primary-600 p-5'>
                            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-primary-50'>
                                {customerBookingContent.hero.eyebrow}
                            </Text>
                            <Text className='mt-3 text-3xl font-bold text-white'>
                                {customerBookingContent.hero.title}
                            </Text>
                            <Text className='mt-3 text-sm leading-6 text-primary-50'>
                                {customerBookingContent.hero.description}
                            </Text>
                            <Button
                                label={customerBookingContent.hero.actionLabel}
                                variant='secondary'
                                className='mt-5 h-12 rounded-xl border-0'
                                textClassName='text-base font-semibold'
                            />
                        </View>

                        <View className='gap-3'>
                            {customerBookingSteps.map((step, index) => (
                                <View
                                    key={step.id}
                                    className='rounded-3xl border border-neutral-200 bg-white p-4'>
                                    <Text className='text-xs font-semibold uppercase tracking-[1.2px] text-primary-600'>
                                        Step {index + 1}
                                    </Text>
                                    <Text className='mt-2 text-lg font-semibold text-neutral-900'>{step.title}</Text>
                                    <Text className='mt-2 text-sm leading-6 text-neutral-500'>{step.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
