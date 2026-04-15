import { FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { SectionHeading } from '@/features/home/components/section-heading'

const hubHighlights = [
    {
        id: 'intake',
        title: 'Vehicle intake',
        value: '11 arrivals',
        description:
            'Three new customer pickups are scheduled before lunch, and pre-delivery checks are already underway.',
    },
    {
        id: 'staffing',
        title: 'Staff coverage',
        value: '7 on shift',
        description:
            'The evening handover is fully staffed, with one reserve agent available for onboarding escalations.',
    },
    {
        id: 'compliance',
        title: 'Pending reviews',
        value: '4 documents',
        description: 'KYC and handover paperwork needs final validation before the next pickup block opens.',
    },
]

export function HubManagerScreen() {
    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <SectionHeading
                            eyebrow='Hub Manager'
                            title='Coordinate handovers, staffing, and compliance'
                            description='This persona layout is centered on hub throughput, team readiness, and customer handoff quality.'
                        />

                        <View className='rounded-[28px] border border-primary-100 bg-primary-50 p-5 dark:border-primary-900/40 dark:bg-primary-900/10'>
                            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-primary-700 dark:text-primary-300'>
                                Hub health
                            </Text>
                            <Text className='mt-3 text-3xl font-bold text-neutral-900 dark:text-neutral-50'>
                                HSR Layout hub is prepared for the afternoon pickup wave
                            </Text>
                            <Text className='mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300'>
                                The current focus is clearing document approvals and staging two vehicles for express
                                handover.
                            </Text>
                        </View>

                        <View className='gap-3'>
                            {hubHighlights.map((item) => (
                                <View
                                    key={item.id}
                                    className='rounded-3xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900'>
                                    <Text className='text-xs font-semibold uppercase tracking-[1.2px] text-primary-600'>
                                        {item.title}
                                    </Text>
                                    <Text className='mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-50'>
                                        {item.value}
                                    </Text>
                                    <Text className='mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400'>
                                        {item.description}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
