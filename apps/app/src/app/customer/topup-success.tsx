import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button, ScrollView, Text, View } from '@/components/ui'

export default function TopUpSuccessScreen() {
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const handleViewPlan = useCallback(() => {
        router.replace('/customer/(tabs)/plans')
    }, [router])

    const handleGoHome = useCallback(() => {
        router.replace('/customer/(tabs)')
    }, [router])

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 32 }}
                showsVerticalScrollIndicator={false}
            >

                <View className='items-center'>
                    <View className='h-36 w-36 items-center justify-center rounded-full bg-success-500/10'>
                        <View className='h-28 w-28 items-center justify-center rounded-full bg-success-500/20'>
                            <View className='h-20 w-20 items-center justify-center rounded-full bg-success-500'>
                                <MaterialCommunityIcons name='battery-charging-high' size={40} color='#FFF' />
                            </View>
                        </View>
                    </View>

                    <Text className='mt-8 text-center text-3xl font-bold text-neutral-900'>
                        Top-Up Applied!
                    </Text>
                    <Text className='mt-3 text-center text-base leading-6 text-neutral-500'>
                        Extra kilometers have been added{'\n'}to your active plan.
                    </Text>
                </View>


                <View className='mt-10 rounded-3xl bg-neutral-50 p-5'>
                    {[
                        {
                            icon: 'plus-circle' as const,
                            color: '#16A34A',
                            bg: '#F0FDF4',
                            title: 'KM added to your plan',
                            subtitle: 'Your remaining kilometers have been increased',
                        },
                        {
                            icon: 'calendar-check' as const,
                            color: '#2563EB',
                            bg: '#EFF6FF',
                            title: 'Validity updated',
                            subtitle: 'If the top-up includes extra days, they\'ve been added',
                        },
                        {
                            icon: 'motorbike-electric' as const,
                            color: '#D97706',
                            bg: '#FFFBEB',
                            title: 'Keep riding!',
                            subtitle: 'Your plan is recharged and ready to go',
                        },
                    ].map((step, index) => (
                        <View key={step.title} className='flex-row gap-4'>
                            <View className='items-center'>
                                <View
                                    style={{ backgroundColor: step.bg }}
                                    className='h-12 w-12 items-center justify-center rounded-full'
                                >
                                    <MaterialCommunityIcons name={step.icon} size={22} color={step.color} />
                                </View>
                                {index < 2 && <View className='my-1 h-6 w-0.5 bg-neutral-200' />}
                            </View>
                            <View className='flex-1 justify-center pb-4'>
                                <Text className='text-base font-semibold text-neutral-900'>{step.title}</Text>
                                <Text className='mt-0.5 text-sm leading-5 text-neutral-500'>{step.subtitle}</Text>
                            </View>
                        </View>
                    ))}
                </View>


                <View className='mt-10 gap-3'>
                    <Button
                        label='View My Plan'
                        onPress={handleViewPlan}
                        className='h-14 rounded-2xl bg-primary-600'
                        textClassName='text-base font-semibold text-white'
                    />
                    <Button
                        label='Go to Home'
                        onPress={handleGoHome}
                        variant='outline'
                        className='h-14 rounded-2xl border-neutral-200'
                        textClassName='text-base font-semibold text-neutral-700'
                    />
                </View>
            </ScrollView>
        </View>
    )
}
