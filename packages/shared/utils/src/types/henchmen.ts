import { EventSchemas, Inngest } from 'inngest'

export interface UserSnippet {
    id: string
    email: string | null
    mobilenumber: string | null
    firstName: string | null
    lastName: string | null
}

export interface UserPlanSnippet {
    id: string
    userId: string
    status: string
    startsAt: string | Date | null
    expiresAt: string | Date | null
    remainingKm: number
    totalKm: number
    user?: UserSnippet
}

export interface StationSnippet {
    id: string
    name: string
    active: boolean
}

export interface VehicleSnippet {
    id: string
    vehicleNumber: string
    rcNumber: string
}

export interface BatterySnippet {
    id: string
    batteryQrId: string
}

export interface BookingSnippet {
    id: string
    status: string
    pickupOtp: string
    stationId: string | null
    vehicleId: string | null
    batteryId: string | null
    createdAt: string | Date
    updatedAt: string | Date
    userPlan?: UserPlanSnippet
    station?: StationSnippet | null
    vehicle?: VehicleSnippet | null
    battery?: BatterySnippet | null
}

export interface BatterySwapHistorySnippet {
    id: string
    bookingId: string
    userPlanId: string
    vehicleId: string | null
    oldBatteryId: string | null
    newBatteryId: string | null
    fromStationId: string | null
    toStationId: string | null
    swappedById: string | null
    createdAt: string | Date
    booking?: BookingSnippet
    vehicle?: VehicleSnippet | null
    oldBattery?: BatterySnippet | null
    newBattery?: BatterySnippet | null
    fromStation?: StationSnippet | null
    toStation?: StationSnippet | null
    swappedBy?: UserSnippet | null
}

const inngest = new Inngest({
    id: 'yugo-henchmen',
    schemas: new EventSchemas().fromRecord<{
        'auth/otp.send': {
            data: {
                channel: 'sms' | 'email' | 'whatsapp' | 'call' | 'sna'
                to: string
            }
        }
        'plan/userPlan.activate': {
            data: {
                userId: string
                userPlanId: string
            }
        }
        'user/user.update': {
            data: {
                userId: string
                user: UserSnippet
            }
        }
        'booking/booking.create': {
            data: {
                userId: string
                booking: BookingSnippet
            }
        }
        'booking/booking.ongoing': {
            data: {
                userId: string
                booking: BookingSnippet
            }
        }
        'booking/booking.completed': {
            data: {
                userId: string
                booking: BookingSnippet
            }
        }
        'booking/battery.swap': {
            data: {
                userId: string
                swapHistory: BatterySwapHistorySnippet
            }
        }
    }>(),
})

export const inngestEvents = [
    {
        eventKey: 'plan/userPlan.activate',
        data: ['userId', 'userPlanId'],
        notificationActive: true,
    },
    {
        eventKey: 'auth/otp.send',
        data: ['channel', 'to'],
        notificationActive: false,
    },
    {
        eventKey: 'user/user.update',
        data: ['user.id', 'user.firstName', 'user.lastName', 'user.email', 'user.mobilenumber'],
        notificationActive: true,
    },
    {
        eventKey: 'booking/booking.create',
        data: [
            'booking.id',
            'booking.status',
            'booking.pickupOtp',
            'booking.station.name',
            'booking.userPlan.id',
            'booking.userPlan.userId',
            'booking.userPlan.user.firstName',
            'booking.userPlan.user.lastName',
            'booking.userPlan.user.email',
            'booking.userPlan.user.mobilenumber',
        ],
        notificationActive: true,
    },
    {
        eventKey: 'booking/booking.ongoing',
        data: [
            'booking.id',
            'booking.status',
            'booking.vehicle.vehicleNumber',
            'booking.vehicle.rcNumber',
            'booking.battery.batteryQrId',
            'booking.station.name',
            'booking.userPlan.id',
            'booking.userPlan.userId',
            'booking.userPlan.user.firstName',
            'booking.userPlan.user.lastName',
            'booking.userPlan.user.email',
            'booking.userPlan.user.mobilenumber',
        ],
        notificationActive: true,
    },
    {
        eventKey: 'booking/booking.completed',
        data: [
            'booking.id',
            'booking.status',
            'booking.vehicle.vehicleNumber',
            'booking.vehicle.rcNumber',
            'booking.battery.batteryQrId',
            'booking.userPlan.id',
            'booking.userPlan.userId',
            'booking.userPlan.user.firstName',
            'booking.userPlan.user.lastName',
            'booking.userPlan.user.email',
            'booking.userPlan.user.mobilenumber',
        ],
        notificationActive: true,
    },
    {
        eventKey: 'booking/battery.swap',
        data: [
            'swapHistory.id',
            'swapHistory.bookingId',
            'swapHistory.userPlanId',
            'swapHistory.vehicle.vehicleNumber',
            'swapHistory.oldBattery.batteryQrId',
            'swapHistory.newBattery.batteryQrId',
            'swapHistory.fromStation.name',
            'swapHistory.toStation.name',
            'swapHistory.swappedBy.firstName',
            'swapHistory.swappedBy.lastName',
            'swapHistory.booking.userPlan.user.firstName',
            'swapHistory.booking.userPlan.user.lastName',
            'swapHistory.booking.userPlan.user.email',
            'swapHistory.booking.userPlan.user.mobilenumber',
        ],
        notificationActive: true,
    },
] as const

export type HenchmenInngestClient = typeof inngest
