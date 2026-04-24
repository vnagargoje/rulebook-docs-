import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { toast } from 'sonner-native'

import { ActionTile, ProfileMenuItem } from '@/components/customer/profile'
import { Button, FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { formatKmIN } from '@/lib/formatters/customer'
import { useMyPlans } from '@/queries/customer'
import { useAuthStore } from '@/stores/auth.store'

export default function CustomerProfileScreen() {
    const router = useRouter()
    const token = useAuthStore.use.token()
    const signOut = useAuthStore.use.signOut()
    const isLoggedIn = Boolean(token)

    const { data: plansData } = useMyPlans({ variables: { status: ['purchased', 'active'] }, enabled: isLoggedIn })

    const activePlan = plansData?.data?.[0]

    const handleLoginPress = useCallback(() => {
        router.push({ pathname: '/auth/sign-in', params: { redirect: '/customer/profile' } })
    }, [router])

    const handleBrowsePlans = useCallback(() => {
        router.push('/customer/(tabs)/plans')
    }, [router])

    const handleBookings = useCallback(() => {
        router.push('/customer/(tabs)/bookings')
    }, [router])

    const handleHelp = useCallback(() => {
        router.push('/customer/(tabs)/help')
    }, [router])

    const handleSignOut = useCallback(() => {
        toast('Sign out?', {
            description: 'You will be signed out of your account.',
            action: {
                label: 'Sign Out',
                onClick: signOut,
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {},
            },
        })
    }, [signOut])

    const handleComingSoon = useCallback((title: string) => {
        toast.info(title, {
            description: 'This section will be available soon.',
        })
    }, [])

    if (!isLoggedIn) {
        return (
            <>
                <FocusAwareStatusBar />
                <SafeAreaView className='flex-1 bg-background'>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 32 }}>
                        <View className='mx-4 mt-4 overflow-hidden rounded-[28px] bg-[#0B1220] p-5'>
                            <View className='absolute -right-10 -top-8 h-32 w-32 rounded-full bg-primary-500/20' />
                            <View className='absolute -left-8 bottom-8 h-24 w-24 rounded-full bg-cyan-400/10' />

                            <View className='h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/20'>
                                <MaterialCommunityIcons name='account-circle-outline' size={30} color='#60A5FA' />
                            </View>
                            <Text className='mt-4 text-2xl font-bold text-white'>Your profile, your rides</Text>
                            <Text className='mt-2 text-sm leading-6 text-[#C6D0E0]'>
                                Sign in only when you are ready to book. Till then, explore plans and compare pricing freely.
                            </Text>

                            <View className='mt-5 gap-2'>
                                {[
                                    'Track bookings and pickup OTP',
                                    'Manage active plans and top-ups',
                                    'Access help and ride support',
                                ].map((item) => (
                                    <View key={item} className='flex-row items-center gap-2'>
                                        <MaterialCommunityIcons name='check-circle' size={14} color='#34D399' />
                                        <Text className='text-xs text-[#C6D0E0]'>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View className='px-4 pt-5'>
                            <Button
                                label='Sign In'
                                onPress={handleLoginPress}
                                className='h-13 rounded-xl bg-primary-600'
                                textClassName='text-base font-semibold text-white'
                            />
                            <Button
                                label='Explore Plans'
                                onPress={handleBrowsePlans}
                                variant='outline'
                                className='mt-3 h-13 rounded-xl border-neutral-200 bg-white'
                                textClassName='text-base font-semibold text-neutral-700'
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        )
    }

    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 32 }}>
                    <View className='mx-4 mt-4 overflow-hidden rounded-[28px] bg-[#0B1220] px-5 pb-6 pt-5'>
                        <View className='absolute -right-10 -top-8 h-32 w-32 rounded-full bg-primary-500/20' />
                        <View className='absolute -left-8 bottom-8 h-24 w-24 rounded-full bg-cyan-400/10' />

                        <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-[#8EA0BE]'>
                            Profile
                        </Text>

                        <View className='mt-4 flex-row items-center gap-4'>
                            <View className='h-16 w-16 items-center justify-center rounded-full bg-white/15'>
                                <Text className='text-2xl font-bold text-white'>
                                {(token?.phoneNumber ?? 'Y')[0].toUpperCase()}
                            </Text>
                            </View>
                            <View className='flex-1'>
                                <Text className='text-xl font-bold text-white'>Yugo Rider</Text>
                                <Text className='mt-0.5 text-sm text-[#A9B8CE]'>
                                    {token?.phoneNumber ?? 'Phone verified'}
                                </Text>
                            </View>
                            <View className='rounded-full bg-success-500/20 px-3 py-1'>
                                <Text className='text-xs font-bold text-success-300'>Verified</Text>
                            </View>
                        </View>

                        <View className='mt-5 flex-row gap-3'>
                            <View className='flex-1 rounded-xl bg-white/10 p-3'>
                                <Text className='text-[10px] uppercase tracking-[1px] text-[#A9B8CE]'>Current Plan</Text>
                                <Text className='mt-1 text-sm font-semibold text-white'>
                                    {(activePlan?.planSnapshot as any)?.name ?? 'No active plan'}
                                </Text>
                            </View>
                            <View className='flex-1 rounded-xl bg-white/10 p-3'>
                                <Text className='text-[10px] uppercase tracking-[1px] text-[#A9B8CE]'>KM Left</Text>
                                <Text className='mt-1 text-sm font-semibold text-white'>
                                    {formatKmIN(Number(activePlan?.remainingKm ?? 0))}
                                </Text>
                            </View>
                            <View className='flex-1 rounded-xl bg-white/10 p-3'>
                                <Text className='text-[10px] uppercase tracking-[1px] text-[#A9B8CE]'>Validity</Text>
                                <Text className='mt-1 text-sm font-semibold text-white'>
                                    {((activePlan?.planSnapshot as any)?.validityDays ?? 0) || '—'} days
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className='gap-5 px-4 pt-6'>
                        <View className='gap-3'>
                            <Text className='px-1 text-xs font-bold uppercase tracking-[1.2px] text-neutral-400'>
                                Quick actions
                            </Text>
                            <View className='flex-row flex-wrap justify-between gap-y-3'>
                                <ActionTile
                                    icon='calendar-check-outline'
                                    title='My Bookings'
                                    subtitle='Track current and past rides'
                                    onPress={handleBookings}
                                    color='#2563EB'
                                />
                                <ActionTile
                                    icon='ticket-percent-outline'
                                    title='My Plans'
                                    subtitle='View plans and top-ups'
                                    onPress={handleBrowsePlans}
                                    color='#D97706'
                                />
                                <ActionTile
                                    icon='help-circle-outline'
                                    title='Help'
                                    subtitle='FAQs and support'
                                    onPress={handleHelp}
                                    color='#6B7280'
                                />
                                <ActionTile
                                    icon='shield-check-outline'
                                    title='KYC Status'
                                    subtitle='Identity verification'
                                    onPress={() => handleComingSoon('KYC Status')}
                                    color='#16A34A'
                                />
                            </View>
                        </View>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-4'>
                            <Text className='px-1 text-xs font-bold uppercase tracking-[1.2px] text-neutral-400'>
                                Account
                            </Text>
                            <View className='mt-2'>
                                <ProfileMenuItem
                                    icon='account-circle-outline'
                                    label='Personal Details'
                                    subtitle='Name, email, phone number'
                                    onPress={() => handleComingSoon('Personal Details')}
                                />
                                <View className='ml-14 border-b border-neutral-100' />
                                <ProfileMenuItem
                                    icon='shield-check-outline'
                                    label='KYC Verification'
                                    subtitle='Identity & address proof'
                                    color='#16A34A'
                                    value='Pending'
                                    onPress={() => handleComingSoon('KYC Verification')}
                                />
                                <View className='ml-14 border-b border-neutral-100' />
                                <ProfileMenuItem
                                    icon='credit-card-outline'
                                    label='Payment Methods'
                                    subtitle='Manage your payment options'
                                    color='#7C3AED'
                                    onPress={() => handleComingSoon('Payment Methods')}
                                />
                            </View>
                        </View>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-4'>
                            <Text className='px-1 text-xs font-bold uppercase tracking-[1.2px] text-neutral-400'>
                                Ride & Bookings
                            </Text>
                            <View className='mt-2'>
                                <ProfileMenuItem
                                    icon='history'
                                    label='Ride History'
                                    subtitle='Past trips and swaps'
                                    color='#0891B2'
                                    onPress={handleBookings}
                                />
                                <View className='ml-14 border-b border-neutral-100' />
                                <ProfileMenuItem
                                    icon='ticket-percent-outline'
                                    label='My Plans'
                                    subtitle='Active and expired plans'
                                    color='#D97706'
                                    onPress={handleBrowsePlans}
                                />
                            </View>
                        </View>

                        <View className='rounded-3xl border border-neutral-200 bg-white p-4'>
                            <Text className='px-1 text-xs font-bold uppercase tracking-[1.2px] text-neutral-400'>
                                Support & Legal
                            </Text>
                            <View className='mt-2'>
                                <ProfileMenuItem
                                    icon='help-circle-outline'
                                    label='Help & FAQ'
                                    subtitle='Get answers to common questions'
                                    color='#6B7280'
                                    onPress={handleHelp}
                                />
                                <View className='ml-14 border-b border-neutral-100' />
                                <ProfileMenuItem
                                    icon='file-document-outline'
                                    label='Terms & Conditions'
                                    color='#6B7280'
                                    onPress={() => handleComingSoon('Terms & Conditions')}
                                />
                                <View className='ml-14 border-b border-neutral-100' />
                                <ProfileMenuItem
                                    icon='lock-outline'
                                    label='Privacy Policy'
                                    color='#6B7280'
                                    onPress={() => handleComingSoon('Privacy Policy')}
                                />
                            </View>
                        </View>

                        <Button
                            label='Sign Out'
                            onPress={handleSignOut}
                            className='h-12 rounded-2xl border border-red-200 bg-red-50'
                            textClassName='text-base font-semibold text-red-600'
                        />

                        <Text className='text-center text-xs text-neutral-400'>
                            App version 1.0.0
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
