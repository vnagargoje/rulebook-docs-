import type { CustomerSupportCard } from '@/types/customer/customer-support.types'

export const customerSupportContent = {
    heading: {
        eyebrow: 'Support',
        title: 'We are here before and during the ride',
        description: 'The support tab brings together the most common help journeys so users can solve problems fast.',
    },
    priorityCard: {
        eyebrow: 'Priority line',
        title: 'Need immediate ride support?',
        description:
            'Reach the station team for urgent pickup or swap issues, then follow up in the help center for billing and KYC questions.',
        actionLabel: 'Contact support',
    },
} as const

export const customerSupportCards: CustomerSupportCard[] = [
    {
        id: 'kyc',
        title: 'KYC help',
        description: 'Fix document upload issues, profile mismatches, or verification delays quickly.',
    },
    {
        id: 'billing',
        title: 'Billing and plans',
        description: 'Review plan charges, payment retries, and subscription updates from one place.',
    },
    {
        id: 'ride',
        title: 'Ride assistance',
        description: 'Get help with pickup OTP, active rides, battery swaps, and station guidance.',
    },
]
