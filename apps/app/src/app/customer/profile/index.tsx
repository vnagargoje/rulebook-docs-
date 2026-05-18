import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'

import {
    EditButton,
    EmptyState,
    InfoRow,
    KycBadge,
    SectionCard,
} from '@/components/profile'
import { ScreenLoader, SafeAreaView, ScrollView, Text, View } from '@/components/ui'
import colors from '@/components/ui/colors'
import { buildAddressLine, formatDateIN, formatGender } from '@/lib/formatters/customer'
import { useKycStatus } from '@/queries/customer/kyc.query'
import { useMyProfile } from '@/queries/profile'
import { useAuthStore } from '@/stores/auth.store'

export default function CustomerProfileDetailsScreen() {
    const router = useRouter()
    const token = useAuthStore.use.token()
    const isLoggedIn = Boolean(token)
    const { data: profile, isLoading: profileLoading } = useMyProfile({ enabled: isLoggedIn })
    const { data: kycStatus } = useKycStatus({ enabled: isLoggedIn })

    const fullName = useMemo(() => {
        const v = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim()
        return v || 'Yugo Rider'
    }, [profile?.firstName, profile?.lastName])

    const initials = useMemo(
        () => (fullName[0] ?? 'Y').toUpperCase(),
        [fullName],
    )

    const permanentAddr = profile?.addresses?.find((a) => a.type === 'permanent')
    const currentAddr = profile?.addresses?.find((a) => a.type === 'current')
    const emergencyContact = profile?.properties?.emergencyContact as
        | { name: string; mobile: string }
        | undefined

    if (profileLoading || !profile) {
        return <ScreenLoader label='Loading profile…' />
    }

    return (
        <SafeAreaView edges={['bottom']} className='flex-1 bg-neutral-50'>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                <View className='mx-4 mt-5 items-center'>
                    <View className='h-20 w-20 items-center justify-center rounded-full bg-primary-100'>
                        <Text className='text-3xl font-bold text-primary-600'>{initials}</Text>
                    </View>
                    <Text className='mt-3 text-xl font-bold text-neutral-900'>{fullName}</Text>
                    <View className='mt-1.5 rounded-full bg-primary-50 px-3 py-1'>
                        <Text className='text-[11px] font-semibold text-primary-600'>
                            {profile.roles?.[0]?.name ?? 'Customer'}
                        </Text>
                    </View>
                </View>

                <SectionCard
                    title='Profile'
                    action={<EditButton onPress={() => router.push('/customer/profile/edit')} />}>
                    <View className='mb-3 flex-row items-center gap-3'>
                        <View className='h-8 w-8 items-center justify-center rounded-xl bg-green-50'>
                            <MaterialCommunityIcons name='phone-check' size={16} color='#16A34A' />
                        </View>
                        <View className='flex-1'>
                            <Text className='text-[11px] font-semibold uppercase tracking-[0.8px] text-neutral-400'>
                                Mobile
                            </Text>
                            <Text className='mt-0.5 text-[14px] font-medium text-neutral-900'>
                                {profile.mobilenumber ?? '—'}
                            </Text>
                        </View>
                        <View className='rounded-full bg-green-100 px-2.5 py-1'>
                            <Text className='text-[10px] font-bold text-green-700'>Verified</Text>
                        </View>
                    </View>
                    <InfoRow label='Email' value={profile.email} icon='email-outline' />
                    <InfoRow
                        label='Full Name'
                        value={[profile.firstName, profile.lastName].filter(Boolean).join(' ') || null}
                        icon='account-outline'
                    />
                    <InfoRow label='Date of Birth' value={profile.dateOfBirth ? formatDateIN(profile.dateOfBirth, { day: '2-digit', month: 'short', year: 'numeric' }) : null} icon='cake-variant-outline' />
                    <InfoRow label='Gender' value={formatGender(profile.gender)} icon='gender-male-female' />
                </SectionCard>

                <SectionCard
                    title='Address'
                    action={<EditButton onPress={() => router.push('/customer/profile/address')} />}>
                    {permanentAddr ? (
                        <>
                            <View className='mb-1.5 flex-row items-center gap-1.5'>
                                <View className='rounded-full bg-primary-50 px-2 py-0.5'>
                                    <Text className='text-[10px] font-bold text-primary-600'>Permanent</Text>
                                </View>
                            </View>
                            <Text className='mb-4 text-[14px] font-medium leading-5 text-neutral-800'>
                                {buildAddressLine(permanentAddr)}
                            </Text>
                        </>
                    ) : (
                        <EmptyState
                            icon='map-marker-outline'
                            message='No permanent address added yet'
                        />
                    )}

                    {currentAddr && currentAddr.id !== permanentAddr?.id ? (
                        <>
                            <View className='mb-1.5 flex-row items-center gap-1.5'>
                                <View className='rounded-full bg-neutral-100 px-2 py-0.5'>
                                    <Text className='text-[10px] font-bold text-neutral-500'>Current</Text>
                                </View>
                            </View>
                            <Text className='text-[14px] font-medium leading-5 text-neutral-800'>
                                {buildAddressLine(currentAddr)}
                            </Text>
                        </>
                    ) : currentAddr && permanentAddr ? (
                        <View className='mt-1 flex-row items-center gap-1.5'>
                            <MaterialCommunityIcons
                                name='check-circle-outline'
                                size={14}
                                color={colors.primary[500]}
                            />
                            <Text className='text-[12px] text-primary-600 font-medium'>
                                Current address same as permanent
                            </Text>
                        </View>
                    ) : null}
                </SectionCard>

                <SectionCard
                    title='Emergency Contact'
                    action={<EditButton onPress={() => router.push('/customer/profile/emergency')} />}>
                    {emergencyContact ? (
                        <>
                            <InfoRow label='Name' value={emergencyContact.name} icon='account-heart-outline' />
                            <InfoRow label='Mobile' value={emergencyContact.mobile} icon='phone-outline' />
                        </>
                    ) : (
                        <EmptyState icon='account-heart-outline' message='No emergency contact added yet' />
                    )}
                </SectionCard>

                <SectionCard title='KYC Verification'>
                    <View className='flex-row gap-3'>
                        <KycBadge label='Aadhaar' status={kycStatus?.aadhaar?.status} />
                        <KycBadge label='PAN' status={kycStatus?.pan?.status} />
                        <KycBadge label='License' status={kycStatus?.license?.status} />
                    </View>
                </SectionCard>

            </ScrollView>
        </SafeAreaView>
    )
}
