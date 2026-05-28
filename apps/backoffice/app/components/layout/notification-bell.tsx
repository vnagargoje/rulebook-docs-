import { Link } from 'react-router'
import { Bell } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { useNotificationBell } from '~/hooks/use-notification-bell'

function getRelativeTime(dateString: string) {
    const diff = (new Date(dateString).getTime() - Date.now()) / 1000;
    const absDiff = Math.abs(diff);

    if (absDiff < 60) return 'Just now';
    if (absDiff < 3600) return `${Math.round(absDiff / 60)} min ago`;
    if (absDiff < 86400) return `${Math.round(absDiff / 3600)} h ago`;
    return `${Math.round(absDiff / 86400)} d ago`;
}

export function NotificationBell() {
    const {
        bookings,
        isOpen,
        lastSeen,
        unreadCount,
        handleOpenChange,
        closePopover,
    } = useNotificationBell()

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 shadow-lg border border-border overflow-hidden rounded-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                    <span className="text-sm font-semibold text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                        <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
                    )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {bookings.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground py-8">
                            No new bookings
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {bookings.map((booking) => {
                                const isUnread = !lastSeen || new Date(booking.createdAt) > new Date(lastSeen)

                                return (
                                    <Link
                                        key={booking.id}
                                        to={`/bookings/${booking.id}`}
                                        className={cn(
                                            "flex flex-col gap-1 p-4 border-b border-border/50 hover:bg-muted/50 transition-colors last:border-0",
                                            isUnread ? "bg-primary/5" : ""
                                        )}
                                        onClick={closePopover}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-sm font-medium leading-none text-foreground">
                                                New Booking
                                            </span>
                                            <span className="text-xs whitespace-nowrap text-muted-foreground">
                                                {getRelativeTime(booking.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-snug mt-1">
                                            <span className="font-medium text-foreground/80">{booking.customerFirstName} {booking.customerLastName}</span> booked at <span className="font-medium text-foreground/80">{booking.stationName}</span>
                                        </p>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
