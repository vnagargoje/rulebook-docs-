import { Button, FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { SectionHeading } from '@/features/home/components/section-heading'

const bookingSteps = [
    {
        id: 'plan',
        title: 'Plan selected',
        description: 'Flexi Plus with unlimited swaps and weekday priority support.',
    },
    {
        id: 'hub',
        title: 'Pickup center',
        description: 'Koramangala Hub, Bangalore. Vehicle handover window at 6:30 PM.',
    },
    {
        id: 'payment',
        title: 'Payment status',
        description: 'Advance payment received. Final confirmation will unlock your pickup OTP.',
    },
]

export function BookingScreen() {
    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <SectionHeading
                            eyebrow='Booking'
                            title='Manage your upcoming ride'
                            description='Keep the pickup center, payment state, and verification details visible in one simple flow.'
                        />

                        <View className='rounded-[28px] bg-primary-600 p-5'>
                            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-primary-50'>
                                Upcoming booking
                            </Text>
                            <Text className='mt-3 text-3xl font-bold text-white'>YG-204 pickup is on track</Text>
                            <Text className='mt-3 text-sm leading-6 text-primary-50'>
                                Your booking is being held until 7:00 PM today. Bring your ID and use the OTP shown on Home during pickup.
                            </Text>
                            <Button
                                label='View booking summary'
                                variant='secondary'
                                className='mt-5 h-12 rounded-xl border-0'
                                textClassName='text-base font-semibold'
                            />
                        </View>

                        <View className='gap-3'>
                            {bookingSteps.map( ( step, index ) => (
                                <View
                                    key={step.id}
                                    className='rounded-3xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900'>
                                    <Text className='text-xs font-semibold uppercase tracking-[1.2px] text-primary-600'>
                                        Step {index + 1}
                                    </Text>
                                    <Text className='mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50'>
                                        {step.title}
                                    </Text>
                                    <Text className='mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400'>
                                        {step.description}
                                    </Text>
                                </View>
                            ) )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
