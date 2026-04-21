import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { CustomerProfileHeroCard } from '@/components/customer/profile-hero-card'
import { CustomerProfileSectionCard } from '@/components/customer/profile-section-card'
import { customerProfileContent, customerProfileSections } from '@/data/customer/customer-profile.data'
import { Button, FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { useAuthStore } from '@/stores/auth.store'

export default function CustomerProfileScreen() {
    const router = useRouter()
    const token = useAuthStore.use.token()
    const signOut = useAuthStore.use.signOut()
    const isLoggedIn = Boolean(token)

    const handleLoginPress = useCallback(() => {
        router.push({
            pathname: '/login',
            params: {
                redirect: '/customer/profile',
            },
        })
    }, [router])

    const handleSignOut = useCallback(() => {
        signOut()
    }, [signOut])

    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <View className='gap-2'>
                            <Text className='text-3xl font-bold text-neutral-900'>{customerProfileContent.title}</Text>
                            <Text className='text-sm leading-6 text-neutral-500'>
                                {customerProfileContent.subtitle}
                            </Text>
                        </View>

                        {!isLoggedIn ? (
                            <View className='rounded-[28px] border border-primary-100 bg-primary-50 p-5'>
                                <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-primary-700'>
                                    {customerProfileContent.guest.eyebrow}
                                </Text>
                                <Text className='mt-3 text-3xl font-bold text-neutral-900'>
                                    {customerProfileContent.guest.title}
                                </Text>
                                <Text className='mt-3 text-sm leading-6 text-neutral-600'>
                                    {customerProfileContent.guest.description}
                                </Text>
                                <Button
                                    label={customerProfileContent.guest.actionLabel}
                                    onPress={handleLoginPress}
                                    className='mt-5 h-12 rounded-xl bg-primary-500'
                                    textClassName='text-base font-semibold text-white'
                                />
                            </View>
                        ) : (
                            <>
                                <CustomerProfileHeroCard
                                    eyebrow={customerProfileContent.member.eyebrow}
                                    title={customerProfileContent.member.title}
                                    description={customerProfileContent.member.description}
                                    statusLabel={customerProfileContent.member.statusLabel}
                                    phoneLabel={customerProfileContent.member.phoneLabel}
                                    phoneValue={token?.phoneNumber || customerProfileContent.member.phoneFallback}
                                />

                                {customerProfileSections.map((section) => (
                                    <CustomerProfileSectionCard
                                        key={section.id}
                                        section={section}
                                    />
                                ))}

                                <Button
                                    label={customerProfileContent.signOutLabel}
                                    onPress={handleSignOut}
                                    className='h-12 rounded-xl bg-neutral-900'
                                    textClassName='text-base font-semibold text-white'
                                />
                            </>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
