import type { CustomerSupportCard } from '@/types/customer/customer-support.types'

export const customerSupportContent = {
    heading: {
        eyebrow: 'Help',
        title: 'Support that keeps the ride moving',
        description: 'Find quick answers for booking, payments, account checks, and swap issues in one place.',
    },
    priorityCard: {
        eyebrow: 'Priority support',
        title: 'Need help with an active booking?',
        description:
            'Use the station desk or contact support if your pickup OTP, vehicle handoff, or payment confirmation needs attention.',
        actionLabel: 'Contact support',
    },
} as const

export const customerSupportCards: CustomerSupportCard[] = [
    {
        id: 'booking',
        iconName: 'calendar-check-outline',
        title: 'Booking assistance',
        description: 'Track pickup details, assigned station, and OTP-related questions before arrival.',
    },
    {
        id: 'billing',
        iconName: 'credit-card-outline',
        title: 'Payments and plans',
        description: 'Review recharge status, active plans, and payment confirmation issues without calling support first.',
    },
    {
        id: 'safety',
        iconName: 'shield-check-outline',
        title: 'KYC and safety',
        description: 'Get guidance for document verification, account review, and profile completion.',
    },
]
