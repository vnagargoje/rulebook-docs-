import type { CustomerHomeQuickAction, CustomerHomeRideStat, CustomerHomeStation } from '@/types/customer/customer-home.types'

export const customerHomeContent = {
    heading: {
        eyebrow: 'Home',
        title: 'Your Yugo ride at a glance',
        description: 'A focused first screen for bookings, battery swaps, and daily ride progress.',
    },
    hero: {
        title: 'Swap, save, and stay ride-ready every day.',
        description: 'Track your booking, battery health, and support access from one Yugo-branded first screen.',
        primaryLabel: 'Open booking',
        secondaryLabel: 'Get support',
    },
    quickActionsSection: {
        eyebrow: 'Quick actions',
        title: 'Everything you need before the next ride',
    },
    rideSection: {
        eyebrow: 'Active ride',
        title: 'Live booking snapshot',
        description: 'Show the most important ride information without making the user hunt through tabs.',
        statusLabel: 'On route',
        routeLabel: 'Ride in progress',
        routeTitle: 'Bellandur to HSR Layout',
        routeDescription: 'Vehicle YG-204 is assigned and the next recommended swap is 6 minutes away.',
    },
    stationSection: {
        eyebrow: 'Nearby stations',
        title: 'Swap points close to your route',
    },
    profileCard: {
        eyebrow: 'Support and safety',
        title: 'Keep KYC, payment, and pickup details within easy reach.',
        description:
            'This layout is designed to surface the next step quickly, whether the user is choosing a plan or riding toward the nearest swap station.',
        actionLabel: 'Review profile settings',
    },
} as const

export const customerHomeQuickActions: CustomerHomeQuickAction[] = [
    {
        id: 'plans',
        title: 'Plans',
        description: 'Compare monthly rides and swap benefits before you book.',
        iconName: 'ticket-percent-outline',
        iconColor: '#1D4ED8',
        accentClassName: 'bg-primary-100',
    },
    {
        id: 'booking',
        title: 'Booking',
        description: 'Review your pickup center, OTP, and payment status in one place.',
        iconName: 'calendar-check-outline',
        iconColor: '#2563EB',
        accentClassName: 'bg-primary-50',
    },
    {
        id: 'stations',
        title: 'Swap stations',
        description: 'See nearby hubs with live battery availability and fast directions.',
        iconName: 'ev-station',
        iconColor: '#B45309',
        accentClassName: 'bg-warning-100',
    },
    {
        id: 'support',
        title: 'Support',
        description: 'Get help with KYC, payments, or ride issues from one support hub.',
        iconName: 'lifebuoy',
        iconColor: '#B45309',
        accentClassName: 'bg-warning-100',
    },
]

export const customerHomeRideStats: CustomerHomeRideStat[] = [
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

export const customerHomeStations: CustomerHomeStation[] = [
    {
        id: 'station-1',
        name: 'Koramangala Hub',
        distance: '1.4 km',
        availability: '12 batteries ready',
        eta: '6 min away',
        statusLabel: 'Open now',
    },
    {
        id: 'station-2',
        name: 'Indiranagar Point',
        distance: '2.1 km',
        availability: '5 batteries ready',
        eta: '9 min away',
        statusLabel: 'Open now',
    },
]
