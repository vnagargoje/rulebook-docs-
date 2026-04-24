export type BookingStatusConfig = {
    label: string
    bg: string
    text: string
}

export type BookingStatusMeta = {
    label: string
    accent: string
    iconColor: string
    icon: string
    badgeBg: string
    badgeText: string
}

export const BOOKING_STATUS_CONFIG: Record<string, BookingStatusConfig> = {
    created: { label: 'Created', bg: 'bg-success-100', text: 'text-success-700' },
    ongoing: { label: 'Ongoing', bg: 'bg-primary-100', text: 'text-primary-700' },
    draft: { label: 'Draft', bg: 'bg-warning-100', text: 'text-warning-700' },
    completed: { label: 'Completed', bg: 'bg-neutral-100', text: 'text-neutral-600' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-700' },
    inactive: { label: 'Inactive', bg: 'bg-neutral-100', text: 'text-neutral-500' },
}

export const BOOKING_STATUS_META: Record<string, BookingStatusMeta> = {
    created: {
        label: 'Booking Confirmed',
        accent: '#16A34A',
        iconColor: '#16A34A',
        icon: 'check-decagram',
        badgeBg: 'bg-success-500/20',
        badgeText: 'text-success-300',
    },
    ongoing: {
        label: 'Ride in Progress',
        accent: '#2563EB',
        iconColor: '#60A5FA',
        icon: 'motorbike-electric',
        badgeBg: 'bg-primary-500/20',
        badgeText: 'text-primary-300',
    },
    draft: {
        label: 'Draft',
        accent: '#D97706',
        iconColor: '#FBBF24',
        icon: 'clock-outline',
        badgeBg: 'bg-warning-500/20',
        badgeText: 'text-warning-300',
    },
    completed: {
        label: 'Completed',
        accent: '#6B7280',
        iconColor: '#9CA3AF',
        icon: 'check-all',
        badgeBg: 'bg-neutral-500/20',
        badgeText: 'text-neutral-300',
    },
    cancelled: {
        label: 'Cancelled',
        accent: '#DC2626',
        iconColor: '#F87171',
        icon: 'close-circle',
        badgeBg: 'bg-red-500/20',
        badgeText: 'text-red-300',
    },
    inactive: {
        label: 'Inactive',
        accent: '#6B7280',
        iconColor: '#9CA3AF',
        icon: 'pause-circle',
        badgeBg: 'bg-neutral-500/20',
        badgeText: 'text-neutral-300',
    },
}

export function getBookingStatusConfig(status: string): BookingStatusConfig {
    return (
        BOOKING_STATUS_CONFIG[status] ?? {
            label: status,
            bg: 'bg-neutral-100',
            text: 'text-neutral-600',
        }
    )
}

export function getBookingStatusMeta(status: string): BookingStatusMeta {
    return (
        BOOKING_STATUS_META[status] ?? {
            label: status,
            accent: '#6B7280',
            iconColor: '#9CA3AF',
            icon: 'help-circle',
            badgeBg: 'bg-neutral-500/20',
            badgeText: 'text-neutral-300',
        }
    )
}
