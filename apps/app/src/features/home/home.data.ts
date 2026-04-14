import type { HomeQuickAction, HomeRideStat, HomeStation } from './home.types'

export const homeQuickActions: HomeQuickAction[] = [
    {
        id: 'plans',
        title: 'Plans',
        description: 'Compare monthly rides and swap benefits before you book.',
        iconLabel: 'PL',
        accentClassName: 'bg-primary-100 text-primary-700',
    },
    {
        id: 'booking',
        title: 'Booking',
        description: 'Review your pickup center, OTP, and payment status in one place.',
        iconLabel: 'BK',
        accentClassName: 'bg-primary-50 text-primary-600',
    },
    {
        id: 'stations',
        title: 'Swap stations',
        description: 'See nearby hubs with live battery availability and fast directions.',
        iconLabel: 'ST',
        accentClassName: 'bg-warning-100 text-warning-700',
    },
    {
        id: 'support',
        title: 'Support',
        description: 'Get help with KYC, payments, or ride issues from one support hub.',
        iconLabel: 'SP',
        accentClassName: 'bg-warning-100 text-warning-700',
    },
]

export const homeRideStats: HomeRideStat[] = [
    {
        id: 'battery',
        label: 'Battery',
        value: '72%',
        hint: 'Good for another 31 km',
    },
    {
        id: 'plan',
        label: 'Current plan',
        value: 'Flexi Plus',
        hint: 'Unlimited swaps this month',
    },
    {
        id: 'otp',
        label: 'Pickup OTP',
        value: '2486',
        hint: 'Share only with the station admin',
    },
]

export const homeStations: HomeStation[] = [
    {
        id: 'station-1',
        name: 'Koramangala Hub',
        distance: '1.4 km',
        availability: '12 batteries ready',
        eta: '6 min away',
    },
    {
        id: 'station-2',
        name: 'Indiranagar Point',
        distance: '2.1 km',
        availability: '5 batteries ready',
        eta: '9 min away',
    },
]
