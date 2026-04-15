import { FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { SectionHeading } from '@/features/home/components/section-heading'

const swapQueue = [
    {
        id: 'queue',
        title: 'Queued swaps',
        value: '18',
        description: 'Two vehicles are due in the next 15 minutes, with one delayed handoff that needs attention.',
    },
    {
        id: 'inventory',
        title: 'Charged batteries',
        value: '42',
        description: 'Inventory is healthy for the afternoon window, but station 3 needs balancing before 5 PM.',
    },
    {
        id: 'sla',
        title: 'Average SLA',
        value: '6 min',
        description: 'Service time is staying inside the target range for active customer swaps today.',
    },
]

export function SwapManagerScreen() {
    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <SectionHeading
                            eyebrow='Swap Manager'
                            title='Monitor swap demand and battery readiness'
                            description='This persona layout is focused on queue visibility, battery inventory, and service response time.'
                        />

                        <View className='rounded-[28px] bg-[#0F172A] p-5'>
                            <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-[#8EA0BE]'>
                                Operations snapshot
                            </Text>
                            <Text className='mt-3 text-3xl font-bold text-white'>
                                Koramangala station is running at 92% readiness
                            </Text>
                            <Text className='mt-3 text-sm leading-6 text-[#CBD5E1]'>
                                One technician is handling a delayed dock reset while the rest of the queue remains on
                                schedule.
                            </Text>
                        </View>

                        <View className='gap-3'>
                            {swapQueue.map((item) => (
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
