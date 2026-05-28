import { useState, useEffect, useMemo } from 'react'
import { useRecentBookingsNotifications } from '~/queries/bookings/use-recent-bookings-notifications'

export function useNotificationBell() {
    const { data: bookings = [] } = useRecentBookingsNotifications()
    const [lastSeen, setLastSeen] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem('lastSeenBookingCreatedAt')
        if (stored) {
            setLastSeen(stored)
        }
    }, [])

    const unreadCount = useMemo(() => {
        if (!lastSeen) return bookings.length;
        return bookings.filter(b => new Date(b.createdAt) > new Date(lastSeen)).length;
    }, [bookings, lastSeen])

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (open && bookings.length > 0) {
            const newest = bookings[0].createdAt
            setLastSeen(newest)
            localStorage.setItem('lastSeenBookingCreatedAt', newest)
        }
    }

    const closePopover = () => setIsOpen(false)

    return {
        bookings,
        isOpen,
        lastSeen,
        unreadCount,
        handleOpenChange,
        closePopover,
    }
}
