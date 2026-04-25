import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { toast } from 'sonner-native'

import { Button, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import { useAuthStore } from '@/stores/auth.store'

export default function HubManagerProfileScreen() {
    const router = useRouter()
    const token = useAuthStore.use.token()
    const signOut = useAuthStore.use.signOut()

    const handleSignOut = useCallback(() => {
        toast('Sign out?', {
            description: 'You will be signed out of your account.',
            action: {
                label: 'Sign Out',
                onClick: () => {
                    signOut()
                    router.replace('/')
                },
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {},
            },
        })
    }, [signOut, router])

    return (
        <SafeAreaView
            className='flex-1 bg-neutral-50'
            edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}>
                <View className='mx-4 mt-4 overflow-hidden rounded-[28px] bg-[#0B1220] px-5 pb-6 pt-5'>
                    <View className='absolute -right-10 -top-8 h-32 w-32 rounded-full bg-primary-500/20' />
                    <View className='absolute -left-8 bottom-8 h-24 w-24 rounded-full bg-cyan-400/10' />

                    <Text className='text-xs font-semibold uppercase tracking-[1.4px] text-[#8EA0BE]'>
                        Hub Station Manager
                    </Text>

                    <View className='mt-4 flex-row items-center gap-4'>
                        <View className='h-16 w-16 items-center justify-center rounded-full bg-white/15'>
                            <MaterialCommunityIcons
                                name='warehouse'
                                size={30}
                                color='#60A5FA'
                            />
                        </View>
                        <View className='flex-1'>
                            <Text className='text-xl font-bold text-white'>Hub Manager</Text>
                            <Text className='mt-0.5 text-sm text-[#A9B8CE]'>
                                {token?.phoneNumber ?? 'Phone verified'}
                            </Text>
                        </View>
                        <View className='rounded-full bg-success-500/20 px-3 py-1'>
                            <Text className='text-xs font-bold text-success-300'>Active</Text>
                        </View>
                    </View>
                </View>

                <View className='gap-5 px-4 pt-6'>
                    <View className='rounded-3xl border border-neutral-200 bg-white p-4'>
                        <Text className='px-1 text-xs font-bold uppercase tracking-[1.2px] text-neutral-400'>
                            Account
                        </Text>
                        <View className='mt-3'>
                            <View className='flex-row items-center py-3.5 px-1'>
                                <View className='h-10 w-10 rounded-xl bg-primary-50 items-center justify-center'>
                                    <MaterialCommunityIcons
                                        name='phone-outline'
                                        size={20}
                                        color='#2563EB'
                                    />
                                </View>
                                <View className='ml-3 flex-1'>
                                    <Text className='text-sm font-semibold text-neutral-900'>Phone Number</Text>
                                    <Text className='text-xs text-neutral-500 mt-0.5'>
                                        {token?.phoneNumber ?? 'Not available'}
                                    </Text>
                                </View>
                            </View>
                            <View className='ml-14 border-b border-neutral-100' />
                            <View className='flex-row items-center py-3.5 px-1'>
                                <View className='h-10 w-10 rounded-xl bg-amber-50 items-center justify-center'>
                                    <MaterialCommunityIcons
                                        name='shield-check-outline'
                                        size={20}
                                        color='#D97706'
                                    />
                                </View>
                                <View className='ml-3 flex-1'>
                                    <Text className='text-sm font-semibold text-neutral-900'>Role</Text>
                                    <Text className='text-xs text-neutral-500 mt-0.5'>Hub Station Manager</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className='rounded-3xl border border-neutral-200 bg-white p-4'>
                        <Text className='px-1 text-xs font-bold uppercase tracking-[1.2px] text-neutral-400'>
                            Support & Legal
                        </Text>
                        <View className='mt-3'>
                            <View className='flex-row items-center py-3.5 px-1'>
                                <View className='h-10 w-10 rounded-xl bg-neutral-100 items-center justify-center'>
                                    <MaterialCommunityIcons
                                        name='file-document-outline'
                                        size={20}
                                        color='#6B7280'
                                    />
                                </View>
                                <View className='ml-3 flex-1'>
                                    <Text className='text-sm font-semibold text-neutral-900'>Terms & Conditions</Text>
                                </View>
                                <MaterialCommunityIcons
                                    name='chevron-right'
                                    size={20}
                                    color='#D1D5DB'
                                />
                            </View>
                            <View className='ml-14 border-b border-neutral-100' />
                            <View className='flex-row items-center py-3.5 px-1'>
                                <View className='h-10 w-10 rounded-xl bg-neutral-100 items-center justify-center'>
                                    <MaterialCommunityIcons
                                        name='lock-outline'
                                        size={20}
                                        color='#6B7280'
                                    />
                                </View>
                                <View className='ml-3 flex-1'>
                                    <Text className='text-sm font-semibold text-neutral-900'>Privacy Policy</Text>
                                </View>
                                <MaterialCommunityIcons
                                    name='chevron-right'
                                    size={20}
                                    color='#D1D5DB'
                                />
                            </View>
                        </View>
                    </View>

                    <Button
                        label='Sign Out'
                        onPress={handleSignOut}
                        className='h-12 rounded-2xl border border-red-200 bg-red-50'
                        textClassName='text-base font-semibold text-red-600'
                    />

                    <Text className='text-center text-xs text-neutral-400'>App version 1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
