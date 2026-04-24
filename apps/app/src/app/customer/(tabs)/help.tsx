import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { SectionHeading } from '@/components/section-heading'
import { customerSupportCards, customerSupportContent } from '@/data/customer/customer-support.data'
import { HELP_FAQS } from '@/data/customer/help-faqs.data'
import { Button, FocusAwareStatusBar, Pressable, SafeAreaView, ScrollView, Text, View } from '@/components/ui'

export default function CustomerHelpScreen() {
    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <SectionHeading {...customerSupportContent.heading} />


                        <View className='rounded-3xl border border-warning-200 bg-warning-50 p-5'>
                            <View className='flex-row items-center gap-3'>
                                <View className='rounded-2xl bg-warning-100 p-2.5'>
                                    <MaterialCommunityIcons name='headset' size={20} color='#D97706' />
                                </View>
                                <Text className='text-[11px] font-semibold uppercase tracking-[1.4px] text-warning-700'>
                                    {customerSupportContent.priorityCard.eyebrow}
                                </Text>
                            </View>
                            <Text className='mt-4 text-xl font-bold text-neutral-900'>
                                {customerSupportContent.priorityCard.title}
                            </Text>
                            <Text className='mt-2 text-sm leading-6 text-neutral-600'>
                                {customerSupportContent.priorityCard.description}
                            </Text>


                            <View className='mt-4 flex-row gap-2'>
                                <View className='flex-1 rounded-2xl bg-white/70 p-3'>
                                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-warning-600'>
                                        Response
                                    </Text>
                                    <Text className='mt-1 text-sm font-bold text-neutral-800'>{'< 2 hrs'}</Text>
                                </View>
                                <View className='flex-1 rounded-2xl bg-white/70 p-3'>
                                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-warning-600'>
                                        Available
                                    </Text>
                                    <Text className='mt-1 text-sm font-bold text-neutral-800'>9 AM – 9 PM</Text>
                                </View>
                                <View className='flex-1 rounded-2xl bg-white/70 p-3'>
                                    <Text className='text-[10px] font-semibold uppercase tracking-[1px] text-warning-600'>
                                        Days
                                    </Text>
                                    <Text className='mt-1 text-sm font-bold text-neutral-800'>Mon – Sat</Text>
                                </View>
                            </View>

                            <Button
                                label={customerSupportContent.priorityCard.actionLabel}
                                className='mt-4 h-12 rounded-xl bg-warning-500'
                                textClassName='text-sm font-semibold text-white'
                            />
                        </View>


                        <View className='gap-3'>
                            {customerSupportCards.map((card) => (
                                <Pressable key={card.id}>
                                    <View className='flex-row items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-4'>
                                        <View className='rounded-2xl bg-primary-50 p-3'>
                                            <MaterialCommunityIcons
                                                name={card.iconName}
                                                size={22}
                                                color='#2563EB'
                                            />
                                        </View>
                                        <View className='flex-1'>
                                            <Text className='text-base font-semibold text-neutral-900'>
                                                {card.title}
                                            </Text>
                                            <Text className='mt-1 text-sm leading-5 text-neutral-500'>
                                                {card.description}
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons name='chevron-right' size={20} color='#D1D5DB' />
                                    </View>
                                </Pressable>
                            ))}
                        </View>


                        <View className='rounded-3xl border border-neutral-200 bg-white p-5'>
                            <View className='mb-4 flex-row items-center gap-3'>
                                <View className='rounded-2xl bg-neutral-50 p-2.5'>
                                    <MaterialCommunityIcons
                                        name='comment-question-outline'
                                        size={20}
                                        color='#6B7280'
                                    />
                                </View>
                                <Text className='text-base font-bold text-neutral-900'>Common questions</Text>
                            </View>
                            {HELP_FAQS.map((faq, i) => (
                                <View key={i}>
                                    {i > 0 && <View className='my-3 h-px bg-neutral-100' />}
                                    <Text className='text-sm font-semibold text-neutral-800'>{faq.q}</Text>
                                    <Text className='mt-1 text-sm leading-5 text-neutral-500'>{faq.a}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
