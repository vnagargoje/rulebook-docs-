import { Button, FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { SectionHeading } from '@/features/home/components/section-heading'

const supportCards = [
    {
        id: 'kyc',
        title: 'KYC help',
        description: 'Fix document upload issues, profile mismatches, or verification delays quickly.',
    },
    {
        id: 'billing',
        title: 'Billing and plans',
        description: 'Review plan charges, payment retries, and subscription updates from one place.',
    },
    {
        id: 'ride',
        title: 'Ride assistance',
        description: 'Get help with pickup OTP, active rides, battery swaps, and station guidance.',
    },
]

export function SupportScreen() {
    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <SectionHeading
                            eyebrow='Support'
                            title='We are here before and during the ride'
                            description='The support tab brings together the most common help journeys so users can solve problems fast.'
                        />

                        <View className='rounded-[28px] border border-warning-200 bg-warning-50 p-5 dark:border-warning-900/40 dark:bg-warning-900/10'>
                            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-warning-700 dark:text-warning-300'>
                                Priority line
                            </Text>
                            <Text className='mt-3 text-3xl font-bold text-neutral-900 dark:text-neutral-50'>
                                Need immediate ride support?
                            </Text>
                            <Text className='mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300'>
                                Reach the station team for urgent pickup or swap issues, then follow up in the help center for billing and KYC questions.
                            </Text>
                            <Button
                                label='Contact support'
                                className='mt-5 h-12 rounded-xl bg-warning-500'
                                textClassName='text-base font-semibold text-white'
                            />
                        </View>

                        <View className='gap-3'>
                            {supportCards.map( ( card ) => (
                                <View
                                    key={card.id}
                                    className='rounded-3xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900'>
                                    <Text className='text-lg font-semibold text-neutral-900 dark:text-neutral-50'>
                                        {card.title}
                                    </Text>
                                    <Text className='mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400'>
                                        {card.description}
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
