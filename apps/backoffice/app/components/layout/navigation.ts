import {
    IconArrowsLeftRight,
    IconBattery,
    IconCalendarEvent,
    IconChecklist,
    IconClipboardCheck,
    IconLayoutDashboard,
    IconMapPin,
    IconMotorbike,
    IconReceiptRupee,
    IconTool,
    IconUsers,
    IconCreditCard,
} from '@tabler/icons-react'

export const NAVIGATION_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', description: 'Operations overview', icon: IconLayoutDashboard },
    {
        label: 'Users',
        description: 'Employees and customers',
        icon: IconUsers,
        children: [
            { to: '/users', label: 'Employee', description: 'Admin and manager accounts' },
            { to: '/customers', label: 'Customers', description: 'Customer accounts' },
        ]
    },
    { to: '/stations', label: 'Stations', description: 'Hubs and swap stations', icon: IconMapPin },
    { 
        label: 'Plans', 
        description: 'Manage subscriptions', 
        icon: IconReceiptRupee,
        children: [
            { to: '/plans', label: 'Subscription Plan', description: 'Monthly & yearly plans' },
            { to: '/top-up-plans', label: 'Top-up Plan', description: 'Additional ride packs' },
        ]
    },
    { to: '/vehicles', label: 'Vehicles', description: 'Fleet registration', icon: IconMotorbike },
    { to: '/bookings', label: 'Bookings', description: 'Customer bookings', icon: IconCalendarEvent },
    { to: '/transactions', label: 'Transactions', description: 'Plan purchases & payments', icon: IconCreditCard },
    { to: '/maintenance', label: 'Maintenance', description: 'Service records', icon: IconTool },
    { to: '/inactive-vehicles', label: 'Inactive Vehicles', description: 'Downtime tracking', icon: IconChecklist },
    { to: '/assignments', label: 'Assignments', description: 'Vehicle allocation', icon: IconArrowsLeftRight },
    { to: '/batteries', label: 'Batteries', description: 'Inventory and stations', icon: IconBattery },
    { to: '/surrender', label: 'Surrender', description: 'Closure workflow', icon: IconClipboardCheck },
]
