import type { CustomerBookingStep } from './customer-booking.types'

export const customerBookingContent = {
    heading: {
        eyebrow: 'Booking',
        title: 'Manage your upcoming ride',
        description: 'Keep the pickup center, payment state, and verification details visible in one simple flow.',
    },
    hero: {
        eyebrow: 'Upcoming booking',
        title: 'YG-204 pickup is on track',
        description:
            'Your booking is being held until 7:00 PM today. Bring your ID and use the OTP shown on Home during pickup.',
        actionLabel: 'View booking summary',
    },
} as const

export const customerBookingSteps: CustomerBookingStep[] = [
    {
        id: 'plan',
        title: 'Plan selected',
        description: 'Flexi Plus with unlimited swaps and weekday priority support.',
    },
    {
        id: 'hub',
        title: 'Pickup center',
        description: 'Koramangala Hub, Bangalore. Vehicle handover window at 6:30 PM.',
    },
    {
        id: 'payment',
        title: 'Payment status',
        description: 'Advance payment received. Final confirmation will unlock your pickup OTP.',
    },
]
