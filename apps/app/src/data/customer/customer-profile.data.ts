import type { CustomerProfileSection } from '@/types/customer/customer-profile.types'

export const customerProfileContent = {
    title: 'Profile',
    subtitle: 'Keep account details, ride readiness, and support preferences easy to review.',
    guest: {
        eyebrow: 'Account access',
        title: 'Sign in to unlock your Yugo profile',
        description: 'Your profile brings together booking readiness, KYC progress, and support preferences.',
        actionLabel: 'Login',
    },
    member: {
        eyebrow: 'Verified rider',
        title: 'Your account is ready to ride',
        description: 'The essentials stay visible here so you can check status quickly before booking or pickup.',
        statusLabel: 'Active',
        phoneLabel: 'Phone number',
        phoneFallback: 'Verified on device',
    },
    signOutLabel: 'Sign out',
} as const

export const customerProfileSections: CustomerProfileSection[] = [
    {
        id: 'account',
        title: 'Account',
        items: [
            { id: 'name', label: 'Full name', value: 'Yugo Rider', iconName: 'account-circle-outline' },
            { id: 'status', label: 'KYC status', value: 'Verified', iconName: 'shield-check-outline' },
            { id: 'plan', label: 'Current plan', value: 'Flexi Plus', iconName: 'ticket-percent-outline' },
        ],
    },
    {
        id: 'ride',
        title: 'Ride details',
        items: [
            { id: 'home-station', label: 'Preferred station', value: 'Koramangala Hub', iconName: 'map-marker-radius-outline' },
            { id: 'support', label: 'Support priority', value: 'Standard', iconName: 'lifebuoy' },
        ],
    },
]
