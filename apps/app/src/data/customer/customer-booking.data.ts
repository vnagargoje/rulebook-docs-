import type { CustomerBookingStep } from '@/types/customer/customer-booking.types'

export const customerBookingContent = {
    heading: {
        eyebrow: 'Booking',
        title: 'Plan the next pickup clearly',
        description: 'Review the ride flow, the documents to keep ready, and the final confirmation before arriving at the station.',
    },
    hero: {
        eyebrow: 'Next ride',
        title: 'Everything for your booking in one flow',
        description: 'This screen keeps pickup readiness, payment checks, and ride confirmation readable for first-time and repeat users.',
        actionLabel: 'Confirm booking',
    },
} as const

export const customerBookingSteps: CustomerBookingStep[] = [
    {
        id: 'station',
        iconName: 'map-marker-radius-outline',
        title: 'Choose your station',
        description: 'Pick the nearest swap point and review battery availability before you leave.',
    },
    {
        id: 'verify',
        iconName: 'shield-check-outline',
        title: 'Verify account details',
        description: 'Keep your KYC and phone verification ready so the handoff stays quick at pickup.',
    },
    {
        id: 'pickup',
        iconName: 'qrcode-scan',
        title: 'Collect with OTP',
        description: 'Use the booking OTP at the desk to confirm pickup and activate the ride safely.',
    },
]
