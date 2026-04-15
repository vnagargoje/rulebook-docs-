import Env from 'env'
import { useCallback } from 'react'
import { customerSettingsContent, getCustomerSettingsSections } from './customer-settings.data'
import { Button, FocusAwareStatusBar, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { useAuthStore } from '@/features/auth/use-auth-store'

export default function CustomerSettingsScreen() {
    const signOut = useAuthStore.use.signOut()
    const handleSignOut = useCallback(() => {
        signOut()
    }, [signOut])
    const sections = getCustomerSettingsSections(Env.EXPO_PUBLIC_NAME, Env.EXPO_PUBLIC_VERSION)

    return (
        <>
            <FocusAwareStatusBar />
            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
                    <View className='gap-6'>
                        <View className='gap-2'>
                            <Text className='text-3xl font-bold text-neutral-900'>{customerSettingsContent.title}</Text>
                            <Text className='text-sm leading-6 text-neutral-500'>
                                {customerSettingsContent.subtitle}
                            </Text>
                        </View>

                        {sections.map((section) => (
                            <View
                                key={section.id}
                                className='rounded-3xl border border-neutral-200 bg-white p-4'>
                                <Text className='text-xs font-semibold uppercase tracking-[1.2px] text-primary-600'>
                                    {section.title}
                                </Text>
                                <View className='mt-4 gap-3'>
                                    {section.items.map((item) => (
                                        <View
                                            key={item.id}
                                            className='rounded-2xl bg-neutral-50 p-4'>
                                            <Text className='text-sm font-medium text-neutral-500'>{item.label}</Text>
                                            {item.value ? (
                                                <Text className='mt-1 text-base font-semibold text-neutral-900'>
                                                    {item.value}
                                                </Text>
                                            ) : null}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}

                        <Button
                            label={customerSettingsContent.signOutLabel}
                            onPress={handleSignOut}
                            className='h-12 rounded-xl bg-neutral-900'
                            textClassName='text-base font-semibold text-white'
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
